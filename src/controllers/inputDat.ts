import { IInputDats } from "@src/models/InputDats";
import { inputDatSchema } from "@src/schemas/inputDats/inputDatSchema";
import {
	getInputDatsByIndicatorService,
	getInputDatsService,
	registerInputDatService,
	registerInputDatsManyService,
	updateInputDatService,
} from "@src/services/inputDatServices";
import { Request, Response } from "express";
import { z } from "zod";
import { redis } from "../utils/redisClient";
import { model, Types } from "mongoose";
import ImportHistory from "@src/models/ImportHistory";
import ListInputDatsModel from "@src/models/ListInputDats";
import InputDatsModel from "@src/models/InputDats";

// Importar los modelos necesarios
const Company = model("Company");
const Branch = model("Branch");
// Usar los modelos importados directamente
const ListInputDat = ListInputDatsModel;
const InputDat = InputDatsModel;

// Interfaz para el objeto de usuario en el request
declare global {
	namespace Express {
		interface User {
			_id: string | Types.ObjectId;
			username?: string;
			email?: string;
			role?: string;
		}
	}
}

export const getInputDats = async (req: Request, res: Response) => {
	try {
		const { branch, year, month, day } = req.params;
		const inputDats = await getInputDatsService(
			branch,
			year ? Number(year) : undefined,
			month ? Number(month) : undefined,
			day ? Number(day) : undefined
		);

		return res.status(200).json(inputDats);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

export const getInputDatsByIndicator = async (req: Request, res: Response) => {
	try {
		const { branch, indicator, year, month, day } = req.params;
		const inputDats = await getInputDatsByIndicatorService(
			branch,
			indicator,
			Number(year),
			Number(month),
			Number(day)
		);
		return res.status(200).json(inputDats);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const registerInputSchema = z.object({
	date: z.preprocess((arg) => new Date(arg as string), z.date()),
	listInputDatId: z.string(),
});

export const registerInputDat = async (req: Request, res: Response) => {
	try {
		const { company, branch } = req.params;
		const parsed = registerInputSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: parsed.error.message });
		}
		const { date, listInputDatId } = parsed.data;
		const { user } = req.user;
		const savedInputDat = await registerInputDatService(
			date,
			listInputDatId,
			user.id,
			company,
			branch
		);
		return res.status(200).json(savedInputDat);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const registerInputDatManySchema = z.object({
	inputDats: z.array(
		inputDatSchema.omit({
			company: true,
			branch: true,
			user: true,
		})
	),
});

export const registerInputDatsMany = async (req: Request, res: Response) => {
	try {
		const { company, branch } = req.params;
		const user = req.user;
		const parsed = registerInputDatManySchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: parsed.error.message });
		}
		const { inputDats } = parsed.data;

		if (!user) {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		// Agregar los campos company, branch y user a cada inputDat
		const inputDatsWithMetadata = inputDats.map((inputDat) => ({
			...inputDat,
			company,
			branch,
			user: {
				username: user.username || user._id || "Unknown",
				email: user.email || "Unknown",
				role: user.role || "Unknown",
			},
		}));

		const savedInputDats = await registerInputDatsManyService(
			company,
			branch,
			inputDatsWithMetadata,
			user._id
		);
		return res.status(200).json(savedInputDats);
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : String(error),
		});
	}
};

interface updateInputDatBody {
	newInputDat: IInputDats;
}

export const updateInputDat = async (
	req: Request<updateInputDatBody>,
	res: Response
) => {
	try {
		const { newInputDat } = req.params;
		const response = await updateInputDatService(newInputDat);
		return res.status(200).json(response);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// Interfaz para el objeto de progreso de importación
interface ImportProgress {
	importId: string | number;
	completed: number;
	total: number;
	status:
		| "starting"
		| "in_progress"
		| "processing_final_batch"
		| "completed"
		| "error";
	year?: string | number;
	company?: string;
	branch?: string;
	startTime?: string;
	endTime?: string;
	progressPercentage?: number;
	created?: number;
	updated?: number;
	errorCount?: number;
	error?: string;
}

// Interfaz para el objeto de usuario autenticado
interface AuthUser {
	_id: string | { toString(): string };
	// Añadir otros campos del usuario según sea necesario
}

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

export const getImportProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// Verificar que req.user existe
		if (!req.user || !req.user._id) {
			res.status(401).send({ message: "Usuario no autenticado" });
			return;
		}

		const userId =
			typeof req.user._id === "string"
				? req.user._id
				: req.user._id.toString();

		// Obtener el ID de la importación actual
		const currentImportId = await redis.get(`import:${userId}:current`);
		console.log(
			`Checking progress for user ${userId}, current import ID: ${currentImportId}`
		);

		if (!currentImportId) {
			res.status(404).send({ message: "No import in progress" });
			return;
		}

		// Construir la clave para obtener los detalles de la importación
		const redisKey = `import:${userId}:${currentImportId}`;

		// Obtener los detalles de la importación
		let progressData = await redis.get(redisKey);
		let progress: ImportProgress;

		// Manejar diferentes tipos de respuesta de Upstash Redis
		if (progressData === null) {
			console.log(`No progress data found for key ${redisKey}`);
			res.status(404).send({ message: "Import data not found" });
			return;
		} else if (typeof progressData === "string") {
			// Si es una cadena, intentar parsearla como JSON
			try {
				progress = JSON.parse(progressData) as ImportProgress;
				console.log(
					`Progress data parsed from string: status=${progress.status}, completed=${progress.completed}/${progress.total}`
				);
			} catch (e: any) {
				console.error("Error parsing progress data:", e);
				res.status(500).send({
					message: "Error parsing progress data",
					error: e.message,
				});
				return;
			}
		} else {
			// Si ya es un objeto, usarlo directamente
			progress = progressData as ImportProgress;
			console.log(
				`Progress data is already an object: status=${progress.status}, completed=${progress.completed}/${progress.total}`
			);
		}

		// Verificar si es una importación recién iniciada o una importación anterior completada
		if (progress.status === "completed") {
			// Comprobar si la importación se completó hace menos de 5 segundos
			const endTime = new Date(progress.endTime || "");
			const now = new Date();
			const timeDiff = (now.getTime() - endTime.getTime()) / 1000; // diferencia en segundos

			console.log(
				`Import completed at ${endTime.toISOString()}, current time: ${now.toISOString()}, diff: ${timeDiff} seconds`
			);

			// Si el frontend consulta el progreso inmediatamente después de iniciar una nueva importación,
			// podría obtener los datos de una importación anterior completada
			// En este caso, verificamos si la importación actual es realmente nueva
			if (
				progress.completed === progress.total &&
				progress.total > 0 &&
				timeDiff > 5
			) {
				// Esta es probablemente una importación anterior completada
				console.log(
					`This appears to be a previously completed import (${timeDiff} seconds ago)`
				);

				// Verificar si hay una importación en curso
				// Intentar actualizar Redis con un estado inicial para la nueva importación
				const newProgress: ImportProgress = {
					importId: currentImportId as string,
					completed: 0,
					total: progress.total, // Mantenemos el total anterior como referencia
					status: "starting",
					year: progress.year,
					company: progress.company,
					branch: progress.branch,
					startTime: new Date().toISOString(),
				};

				await redis.set(redisKey, JSON.stringify(newProgress));

				// Actualizar el objeto progress para la respuesta
				progress = {
					...newProgress,
					progressPercentage: 0,
				};

				console.log(
					`Reset progress for new import: ${currentImportId}`
				);
			}
		}

		// Calcular el porcentaje de progreso
		if (progress && progress.total > 0 && !progress.progressPercentage) {
			progress.progressPercentage = Math.round(
				(progress.completed / progress.total) * 100
			);
		} else if (progress && !progress.progressPercentage) {
			progress.progressPercentage = 0;
		}

		res.status(200).send(progress);
	} catch (error: any) {
		console.error("Error getting import progress:", error);
		res.status(500).send({
			message: "Error getting import progress",
			error: error.message,
		});
	}
};

// Interfaces para la función checkExistingInputDats
export interface VerificationRequestParams {
	company: string;
	branch: string;
}

interface VerificationRequestBody {
	data: Array<Record<string, any>>;
	year: string | number;
}

interface ExistingDataInfo {
	exists: boolean;
	value?: number;
	date?: Date;
	id?: string;
}

interface IndicatorVerificationResult {
	exists: boolean;
	id?: string;
	months: Record<string, ExistingDataInfo>;
}

interface VerificationResponse {
	year: string | number;
	company: string;
	branch: string;
	indicators: Record<string, IndicatorVerificationResult>;
	summary: {
		total: number;
		withExistingData: number;
	};
}

export const checkExistingInputDats = async (
	req: Request<Record<string, string>, {}, VerificationRequestBody>,
	res: Response
): Promise<Response> => {
	try {
		console.log("Starting data verification process");

		const { company, branch } = req.params;
		const { data, year } = req.body;

		console.log(`Request params: company=${company}, branch=${branch}`);
		console.log(
			`Request body: year=${year}, data length=${
				data ? data.length : "undefined"
			}`
		);

		if (!data || !Array.isArray(data)) {
			return res
				.status(400)
				.send({ message: "Invalid data format. Expected an array." });
		}

		if (!year) {
			return res.status(400).send({ message: "Year is required" });
		}

		console.log("Verifying company and branch...");
		const currentCompany = await Company.findById(company);
		if (!currentCompany) {
			console.log("Company not found");
			return res.status(400).send({ message: "Company not found" });
		}

		const currentBranch = await Branch.findById(branch);
		if (!currentBranch) {
			console.log("Branch not found");
			return res.status(400).send({ message: "Branch not found" });
		}

		const months = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];

		// Extraer todos los nombres de indicadores del array de datos
		const indicatorNames = data
			.map((row) => row["NOMBRE INDICADOR"])
			.filter((name) => name); // Filtrar nombres vacíos

		console.log(
			`Found ${indicatorNames.length} unique indicators to check`
		);

		// Buscar todos los indicadores en una sola consulta
		const listInputDats = await ListInputDat.find({
			name: { $in: indicatorNames },
		});

		console.log(
			`Found ${listInputDats.length} existing indicators in database`
		);

		// Crear un mapa para acceso rápido por nombre
		const listInputDatMap: Record<string, any> = {};
		listInputDats.forEach((indicator) => {
			listInputDatMap[indicator.name] = indicator;
		});

		// Crear un rango de fechas para todo el año
		const startDate = new Date(parseInt(year.toString()), 0, 1);
		const endDate = new Date(parseInt(year.toString()) + 1, 0, 1);

		// Obtener todos los IDs de los indicadores encontrados
		const listInputDatIds = listInputDats.map((indicator) => indicator._id);

		// Buscar todos los datos existentes para estos indicadores en este año en una sola consulta
		const existingData = await InputDat.find({
			listInputDat: { $in: listInputDatIds },
			company: company,
			branch: branch,
			date: { $gte: startDate, $lt: endDate },
		});

		console.log(
			`Found ${existingData.length} existing data points for the year ${year}`
		);

		// Crear un mapa para acceso rápido a los datos existentes
		const existingDataMap: Record<
			string,
			Record<number, ExistingDataInfo>
		> = {};
		existingData.forEach((data) => {
			const indicatorId = data.listInputDat.toString();
			const month = data.date.getMonth();

			if (!existingDataMap[indicatorId]) {
				existingDataMap[indicatorId] = {};
			}

			existingDataMap[indicatorId][month] = {
				exists: true,
				value: data.value,
				date: data.date,
				id: data._id.toString(),
			};
		});

		// Objeto para almacenar los resultados de la verificación
		const verificationResults: Record<string, IndicatorVerificationResult> =
			{};

		// Procesar cada indicador
		for (const indicatorName of indicatorNames) {
			const listInputDat = listInputDatMap[indicatorName];

			if (!listInputDat) {
				// Si el indicador no existe, no hay datos que verificar
				verificationResults[indicatorName] = {
					exists: false,
					months: {},
				};
				continue;
			}

			// Si el indicador existe, verificar qué meses tienen datos
			const existingMonths: Record<string, ExistingDataInfo> = {};
			const indicatorId = listInputDat._id.toString();
			const indicatorData = existingDataMap[indicatorId] || {};

			for (let i = 0; i < months.length; i++) {
				const month = months[i];

				if (indicatorData[i]) {
					// Existe dato para este mes
					existingMonths[month] = indicatorData[i];
				} else {
					// No existe dato para este mes
					existingMonths[month] = {
						exists: false,
					};
				}
			}

			verificationResults[indicatorName] = {
				exists: true,
				id: indicatorId,
				months: existingMonths,
			};
		}

		// Preparar respuesta con los datos verificados
		const response: VerificationResponse = {
			year,
			company: currentCompany.name,
			branch: currentBranch.name,
			indicators: verificationResults,
			summary: {
				total: Object.keys(verificationResults).length,
				withExistingData: Object.values(verificationResults).filter(
					(indicator) =>
						indicator.exists &&
						Object.values(indicator.months).some(
							(month) => month.exists
						)
				).length,
			},
		};

		return res.status(200).send(response);
	} catch (error: any) {
		console.error("Error in checkExistingInputDats:", error);

		if (error.name === "ValidationError") {
			return res.status(400).send({ message: error.message });
		}

		return res.status(500).send({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

// Interfaz para los parámetros de consulta
interface ImportHistoryQueryParams {
	year?: string;
	limit?: string;
	page?: string;
}

export const getImportHistory = async (
	req: Request<{}, {}, {}, ImportHistoryQueryParams>,
	res: Response
): Promise<Response> => {
	try {
		// Verificar que req.user existe
		if (!req.user || !req.user._id) {
			return res.status(401).send({ message: "Usuario no autenticado" });
		}

		const userId =
			typeof req.user._id === "string"
				? req.user._id
				: req.user._id.toString();
		const { year, limit = "10", page = "1" } = req.query;

		// Construir el filtro
		const filter: Record<string, any> = { userId };
		if (year) {
			filter.year = parseInt(year);
		}

		// Calcular el skip para la paginación
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Obtener el historial de importaciones usando el modelo importado directamente
		const importHistory = await ImportHistory.find(filter)
			.sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente (más reciente primero)
			.skip(skip)
			.limit(parseInt(limit))
			.populate("company", "name")
			.populate("branch", "name");

		// Obtener el total de registros para la paginación
		const total = await ImportHistory.countDocuments(filter);

		return res.status(200).send({
			history: importHistory,
			pagination: {
				total,
				page: parseInt(page),
				limit: parseInt(limit),
				pages: Math.ceil(total / parseInt(limit)),
			},
		});
	} catch (error: any) {
		console.error("Error getting import history:", error);
		return res.status(500).send({
			message: "Error getting import history",
			error: error.message,
		});
	}
};

// Interfaces para importInputDats
export interface ImportRequestParams {
	company: string;
	branch: string;
	[key: string]: string | undefined; // Añadir firma de índice para compatibilidad con ParamsDictionary
}

export interface ImportRequestBody {
	data: Array<Record<string, any>>;
	year: string | number;
}

interface ImportResults {
	created: Array<{
		indicator: string;
		month: string;
		value: number;
		date: Date;
	}>;
	updated: Array<{
		indicator: string;
		month: string;
		value: number;
		date: Date;
		previousValue: number;
	}>;
}

interface UserInfo {
	username: string;
	email: string;
	role: string;
}

export const importInputDats = async (
	req: Request<ImportRequestParams, {}, ImportRequestBody>,
	res: Response
): Promise<Response> => {
	try {
		console.log("Starting import process");

		const { company, branch } = req.params;
		const { data, year } = req.body;

		console.log(`Request params: company=${company}, branch=${branch}`);
		console.log(
			`Request body: year=${year}, data length=${
				data ? data.length : "undefined"
			}`
		);

		if (!data || !Array.isArray(data)) {
			return res
				.status(400)
				.send({ message: "Invalid data format. Expected an array." });
		}

		if (!year) {
			return res.status(400).send({ message: "Year is required" });
		}
		console.log("Verifying company and branch...");
		const currentCompany = await Company.findById(company);
		if (!currentCompany) {
			console.log("Company not found");
			return res.status(400).send({ message: "Company not found" });
		}

		const currentBranch = await Branch.findById(branch);
		if (!currentBranch) {
			console.log("Branch not found");
			return res.status(400).send({ message: "Branch not found" });
		}

		if (!req.user || !req.user._id) {
			return res.status(401).send({ message: "Usuario no autenticado" });
		}

		const currentUser = req.user;
		const userId =
			typeof currentUser._id === "string"
				? currentUser._id
				: currentUser._id.toString();
		const User = model("User");
		const user = await User.findById(userId);
		const userInfo: UserInfo = {
			username: user.username,
			email: user.email,
			role: user.role,
		};

		const months = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];

		const results: ImportResults = {
			created: [],
			updated: [],
		};
		const errors: string[] = [];
		const bulkOps: any[] = [];
		const listInputCache: Record<string, any> = {};

		// Variables para medir progreso
		const totalRows = data.length;
		let completedRows = 0;

		// Generar un ID único para esta importación
		const importId = new Date().getTime();
		const redisKey = `import:${userId}:${importId}`;

		// IMPORTANTE: Primero actualizar el ID de importación actual antes de inicializar el progreso
		await redis.set(`import:${userId}:current`, importId.toString());
		console.log(`Set current import ID for user ${userId} to ${importId}`);

		// Inicializar el progreso en Redis
		const initialProgress: ImportProgress = {
			importId,
			completed: 0,
			total: totalRows,
			status: "in_progress",
			year,
			company,
			branch,
			startTime: new Date().toISOString(),
		};

		await redis.set(redisKey, JSON.stringify(initialProgress));

		// Establecer un tiempo de expiración para la clave (24 horas)
		await redis.expire(redisKey, 86400);
		await redis.expire(`import:${userId}:current`, 86400);
		console.log("Processing each indicator data row...");
		for (const row of data) {
			const indicatorName = row["NOMBRE INDICADOR"];
			if (!indicatorName) {
				errors.push("Row missing indicator name");
				continue;
			}

			let listInputDat;
			if (listInputCache[indicatorName]) {
				listInputDat = listInputCache[indicatorName];
			} else {
				listInputDat = await ListInputDat.findOne({
					name: indicatorName,
				});

				if (!listInputDat) {
					listInputDat = new (model("ListInputDat"))({
						_id: new Types.ObjectId(),
						name: indicatorName,
						description: `Imported indicator: ${indicatorName}`,
						measurement: "units",
						category: "Ambiental",
						subcategory: "Salida de materiales",
					});
					await listInputDat.save();
				}

				listInputCache[indicatorName] = listInputDat;
			}

			for (let i = 0; i < months.length; i++) {
				const month = months[i];
				const value = row[month];

				if (value === undefined || value === null || value === "")
					continue;

				const numericValue = parseFloat(
					value.toString().replace(",", ".")
				);
				if (isNaN(numericValue)) {
					errors.push(
						`Invalid value for ${indicatorName} in ${month}: ${value}`
					);
					continue;
				}

				const date = new Date(parseInt(year.toString()), i, 1);

				// Verificar si ya existe un registro para este indicador, mes, año, compañía y sucursal
				const existingRecord = await InputDat.findOne({
					listInputDat: listInputDat._id,
					company: company,
					branch: branch,
					date: {
						$gte: new Date(parseInt(year.toString()), i, 1),
						$lt: new Date(parseInt(year.toString()), i + 1, 1),
					},
				});

				if (existingRecord) {
					// Actualizar el registro existente
					bulkOps.push({
						updateOne: {
							filter: { _id: existingRecord._id },
							update: {
								$set: {
									value: numericValue,
									user: userInfo,
									updatedAt: new Date(),
								},
							},
						},
					});

					results.updated.push({
						indicator: indicatorName,
						month: month,
						value: numericValue,
						date: date,
						previousValue: existingRecord.value,
					});
				} else {
					// Crear un nuevo registro
					bulkOps.push({
						insertOne: {
							document: {
								_id: new Types.ObjectId(),
								value: numericValue,
								date: date,
								listInputDat: listInputDat._id,
								company: company,
								branch: branch,
								user: userInfo,
							},
						},
					});

					results.created.push({
						indicator: indicatorName,
						month: month,
						value: numericValue,
						date: date,
					});
				}
			}

			// Actualizar el progreso
			completedRows++;

			// Actualizar Redis cada 2 filas o al finalizar
			if (completedRows % 2 === 0 || completedRows === totalRows) {
				const progressUpdate: ImportProgress = {
					importId,
					completed: completedRows,
					total: totalRows,
					status: "in_progress",
					year,
					company,
					branch,
					startTime: new Date().toISOString(),
				};
				await redis.set(redisKey, JSON.stringify(progressUpdate));
				console.log(
					`Progress updated: ${completedRows}/${totalRows} rows processed`
				);
			}
		}
		// Asegurarse de que Redis muestre el progreso correcto antes de ejecutar el bulkWrite final
		const processingProgress: ImportProgress = {
			importId,
			completed: totalRows,
			total: totalRows,
			status: "processing_final_batch",
			year,
			company,
			branch,
			startTime: new Date().toISOString(),
		};
		await redis.set(redisKey, JSON.stringify(processingProgress));

		if (bulkOps.length > 0) {
			console.log(
				`Executing ${bulkOps.length} operations (${results.created.length} inserts, ${results.updated.length} updates)...`
			);
			await InputDat.bulkWrite(bulkOps);
		}

		// Marcar como completado en Redis
		const finalProgress: ImportProgress = {
			importId,
			completed: totalRows,
			total: totalRows,
			status: "completed",
			created: results.created.length,
			updated: results.updated.length,
			errorCount: errors.length,
			year,
			company,
			branch,
			startTime: new Date().toISOString(),
			endTime: new Date().toISOString(),
		};
		await redis.set(redisKey, JSON.stringify(finalProgress));

		// Guardar el historial de importación en MongoDB
		const importHistory = new ImportHistory({
			importId: importId.toString(),
			userId: userId,
			company: company,
			branch: branch,
			year: year,
			total: totalRows,
			created: results.created.length,
			updated: results.updated.length,
			errorCount: errors.length,
			status: "completed",
			startTime: finalProgress.startTime,
			endTime: finalProgress.endTime,
		});
		await importHistory.save();

		console.log("Import process completed.");
		return res.status(200).send({
			message: "Data imported successfully",
			created: results.created.length,
			updated: results.updated.length,
			errors: errors.length > 0 ? errors : undefined,
			importId,
		});
	} catch (error: any) {
		console.error("Error importing data:", error);

		// Registrar el error en Redis si hay un userId disponible
		if (req.user && req.user._id) {
			try {
				const userId =
					typeof req.user._id === "string"
						? req.user._id
						: req.user._id.toString();
				const importId = await redis.get(`import:${userId}:current`);

				if (importId) {
					const redisKey = `import:${userId}:${importId}`;
					const errorProgress: ImportProgress = {
						importId:
							typeof importId === "string"
								? importId
								: importId.toString(),
						completed: 0,
						total: 0,
						status: "error",
						error: error.message,
						endTime: new Date().toISOString(),
					};
					await redis.set(redisKey, JSON.stringify(errorProgress));
					await redis.expire(redisKey, 86400); // 24 horas
					console.log(
						`Error status saved to Redis for import ${importId}`
					);
				}
			} catch (redisError) {
				console.error(
					"Error updating Redis with error status:",
					redisError
				);
				// Continuar con el flujo normal incluso si hay error al actualizar Redis
			}
		}

		if (error.name === "ValidationError") {
			return res.status(400).send({ message: error.message });
		}
		return res.status(500).send({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

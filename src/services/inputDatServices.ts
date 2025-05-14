import BranchModel from "@src/models/Branches";
import CompanyModel from "@src/models/Company";
import IndicatorModel from "@src/models/Indicators";
import InputDatsModel, { IInputDats } from "@src/models/InputDats";
import UserModel from "@src/models/Users";
import { InputDatDTO } from "@src/schemas/inputDats/inputDatSchema";
import { startSession, Types } from "mongoose";

export const getInputDatsService = async (
	branchId: string,
	year?: number,
	month?: number,
	day?: number
) => {
	try {
		let startDate, endDate;
		if (year) {
			if (month) {
				if (day) {
					// Year, Month and Day provided
					startDate = new Date(year, month - 1, day);
					endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
				} else {
					// Year and Month provided
					startDate = new Date(year, month - 1);
					endDate = new Date(year, month, 0, 23, 59, 59, 999);
				}
			} else {
				// Only Year provided
				startDate = new Date(year, 0);
				endDate = new Date(year, 11, 31, 23, 59, 59, 999);
			}
		}
		let query = { branchId, date: { $gte: startDate, $lte: endDate } };
		const inputDats = await InputDatsModel.find(query).populate(
			"listInputDat"
		);

		if (!inputDats) {
			throw new Error("No se encontraron datos de entrada");
		}
		return inputDats;
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los datos de entrada");
	}
};

export const getInputDatsByIndicatorService = async (
	branchId: string,
	indicatorId: string,
	year?: number,
	month?: number,
	day?: number
) => {
	try {
		const currentIndicator = await IndicatorModel.findById(indicatorId);
		const currentBranch = await BranchModel.findById(branchId);

		if (!currentIndicator || !currentBranch) {
			throw new Error("No se encontraron datos de entrada");
		}

		if (!year) {
			const inputDats = await InputDatsModel.aggregate([
				{
					$match: {
						indicator: new Types.ObjectId(indicatorId),
						branch: new Types.ObjectId(branchId),
					},
				},
			]);
			if (!inputDats) {
				throw new Error("No se encontraron datos de entrada");
			}
			return inputDats;
		} else if (!month) {
			const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
			const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
			const inputDats = await InputDatsModel.aggregate([
				{
					$match: {
						date: {
							$gte: startDate,
							$lte: endDate,
						},
						indicator: new Types.ObjectId(indicatorId),
						branch: new Types.ObjectId(branchId),
					},
				},
			]);

			if (!inputDats) {
				throw new Error("No se encontraron datos de entrada");
			}
			return inputDats;
		} else if (!day) {
			const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
			const endDate = new Date(year, month, 0, 23, 59, 59, 999);
			const inputDats = await InputDatsModel.aggregate([
				{
					$match: {
						date: {
							$gte: startDate,
							$lte: endDate,
						},
						indicator: new Types.ObjectId(indicatorId),
						branch: new Types.ObjectId(branchId),
					},
				},
			]);
			if (!inputDats) {
				throw new Error("No se encontraron datos de entrada");
			}
			return inputDats;
		} else {
			const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
			const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
			const inputDats = await InputDatsModel.aggregate([
				{
					$match: {
						date: {
							$gte: startDate,
							$lte: endDate,
						},
						indicator: new Types.ObjectId(indicatorId),
						branch: new Types.ObjectId(branchId),
					},
				},
			]);
			if (!inputDats) {
				throw new Error("No se encontraron datos de entrada");
			}
			return inputDats;
		}
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los datos de entrada");
	}
};

export const registerInputDatService = async (
	date: Date,
	listInputDatId: string,
	userId: string,
	companyId: string,
	branchId: string
) => {
	try {
		const providedDate = new Date(date);
		const month = providedDate.getMonth();
		const year = providedDate.getFullYear();

		const currentUser = await UserModel.findById(userId);
		const currentBranch = await BranchModel.findById(branchId);
		if (!currentUser || !currentBranch) {
			throw new Error("Usuario o sucursal no encontrados");
		}
		const existingInputDat = await InputDatsModel.findOne({
			listInputDatId,
			companyId,
			branchId,
			date: {
				$gte: new Date(year, month, 1),
				$lte: new Date(year, month + 1, 1),
			},
		});

		if (existingInputDat) {
			throw new Error(
				"Ya existe un registro de datos de entrada para este mes"
			);
		}

		const newInputDat = new InputDatsModel({
			_id: new Types.ObjectId(),
			user: {
				username: currentUser.username,
				userId: currentUser._id,
				email: currentUser.email,
				role: currentUser.role,
			},
			company: companyId,
			branch: branchId,
		});

		const savedInputDat = await newInputDat.save();
		if (!savedInputDat) {
			throw new Error("Error al registrar los datos de entrada");
		} else {
			//Verify if the input is already in the branch
			const existingListInputDat = await BranchModel.findOne({
				_id: branchId,
				inputDats: listInputDatId,
			});
			if (!existingListInputDat) {
				//Register input Dat in the branch
				//Trasnform the list input id to object id
				const listInputDatIdObject = new Types.ObjectId(listInputDatId);
				currentBranch.inputDats.push(listInputDatIdObject);
				const response = await currentBranch.save();
				if (!response) {
					throw new Error("Error al registrar los datos de entrada");
				}
			}
			return savedInputDat;
		}
		//Register input Dat in the branch
	} catch (error) {
		console.error(error);
		throw new Error("Error al registrar los datos de entrada");
	}
};

export const registerInputDatsManyService = async (
	companyId: string,
	branchId: string,
	inputDats: InputDatDTO[],
	userId: string
) => {
	const session = await startSession();
	try {
		const currentCompany = await CompanyModel.findById(companyId);
		const currentBranch = await BranchModel.findById(branchId);
		const currentUser = await UserModel.findById(userId);

		if (!currentCompany || !currentBranch || !currentUser) {
			throw new Error(
				"No se encontró la empresa, la sucursal o el usuario"
			);
		}
		//Start transaction
		await session.withTransaction(async () => {
			for (let inputDat of inputDats) {
				inputDat.user = {
					username: currentUser.username,
					email: currentUser.email,
					role: currentUser.role,
				};

				if (inputDat._id) {
					const currentInputDat = await InputDatsModel.findById(
						inputDat._id
					).session(session);
					if (!currentInputDat) {
						throw new Error("No se encontró el dato de entrada");
					}
					if (currentInputDat.value !== inputDat.value) {
						currentInputDat.value = inputDat.value;
						const savedInputDat = await currentInputDat.save({
							session,
						});
						if (!savedInputDat) {
							throw new Error(
								"Error al actualizar el dato de entrada"
							);
						}
					}
				} else {
					inputDat.company = companyId;
					inputDat.branch = branchId;
					inputDat._id = new Types.ObjectId().toString();

					const newInputDat = new InputDatsModel({
						...inputDat,
					});
					//Have to verify if the date is already registered
					const auxDate = new Date(inputDat.date);

					const existingInputDat = await InputDatsModel.findOne({
						listInputDat: inputDat.listInputDat,
						company: companyId,
						branch: branchId,
						date: {
							$gte: new Date(
								auxDate.getFullYear(),
								auxDate.getMonth(),
								1
							),
							$lt: new Date(
								auxDate.getFullYear(),
								auxDate.getMonth() + 1,
								1
							),
						},
					});
					if (existingInputDat) {
						throw new Error("El dato de entrada ya existe");
					} else {
						const savedInputDat = await newInputDat.save({
							session,
						});

						if (savedInputDat) {
							const existingListInputDat =
								await BranchModel.findOne({
									_id: branchId,
									inputDats: inputDat.listInputDat,
								}).session(session);
							if (!existingListInputDat) {
								currentBranch.inputDats.push(
									new Types.ObjectId(inputDat.listInputDat)
								);
								const response = await currentBranch.save({
									session,
								});
								if (!response) {
									throw new Error(
										"Error al guardar el dato de entrada"
									);
								}
							}
						}
					}
				}
			}
		});
		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		console.error(error);
		throw new Error("Error al crear el dato de entrada");
	}
};

export const updateInputDatService = async (newInputDat: IInputDats) => {
	try {
		const response = await InputDatsModel.findByIdAndUpdate(
			newInputDat._id,
			newInputDat,
			{ new: true }
		);
		if (!response) {
			throw new Error("Error al actualizar el dato de entrada");
		}
		return response;
	} catch (error) {
		console.error(error);
		throw new Error("Error al actualizar el dato de entrada");
	}
};

export const checkExistingInputDatService = async (
	companyId: string,
	branchId: string,
	data: IInputDats[],
	year: number
) => {
	try {
		const currentCompany = await CompanyModel.findById(companyId);
		const currentBranch = await BranchModel.findById(branchId);
		if (!currentCompany || !currentBranch) {
			throw new Error("Compañía o sucursal no encontrada");
		}
		//*TODO: Completar esta función
		// const indicatorNames = data
		// 	.map((inputDat) => inputDat["NOMBRE INDICADOR"])
		// 	.filter((name) => name !== undefined);
	} catch (error) {
		console.error(error);
	}
};

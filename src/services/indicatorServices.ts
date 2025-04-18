import Branch from "@src/models/Branches";
import IndicatorModel from "@src/models/Indicators";
import InputDatsModel from "@src/models/InputDats";
import ListInputDatsModel from "@src/models/ListInputDats";
import { getMonthName } from "@src/utils/dates";
import { getValue, GetValueResult } from "@src/utils/valuesIndicator";

export const getIndicatorsService = async (branchId: string) => {
	try {
		const branch = await Branch.findById(branchId);
		if (!branch) {
			throw new Error("Sucursal no encontrada");
		}
		const indicators = await IndicatorModel.find();
		if (!indicators) {
			throw new Error("No se encontraron indicadores");
		}
		const branchIndicators = indicators.filter((indicator) =>
			indicator.inputDats.some((input) =>
				branch.inputDats.includes(input)
			)
		);
		return branchIndicators;
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los indicadores");
	}
};

export const getIndicatorInfoService = async (indicatorId: string) => {
	try {
		const indicator = await IndicatorModel.findById(indicatorId);
		if (!indicator) {
			throw new Error("Indicador no encontrado");
		}
		const inputDats = await ListInputDatsModel.find({
			_id: { $in: indicator.inputDats },
		}).select("name");
		if (!inputDats) {
			throw new Error("No se encontraron datos de entrada");
		}
		return { indicator, inputDats };
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener la información del indicador");
	}
};

export const getIndicatorValueService = async (
	branchId: string,
	indicatorId: string,
	year: number,
	month?: number
) => {
	try {
		const currentIndicator = await IndicatorModel.findById(indicatorId);
		if (!currentIndicator) {
			throw new Error("Indicador no encontrado");
		}
		const currentBranch = await Branch.findById(branchId);
		if (!currentBranch) {
			throw new Error("Sucursal no encontrada");
		}

		const listInputDatsIndexes = currentIndicator.inputDats.map(
			(input) => input._id
		);

		const monthValues = [];

		if (!month) {
			for (let i = 1; i <= 12; i++) {
				const startDate = new Date(year, i - 1, 1, 0, 0, 0, 0);
				const endDate = new Date(year, i, 0, 23, 59, 59, 999);
				const monthValue: {
					year: number;
					month: string;
					index: number;
					value: GetValueResult;
				} = {
					year: year,
					month: getMonthName(i),
					index: i,
					value: {
						result: -1,
						details: {},
					},
				};
				let inputDatValues = await InputDatsModel.aggregate([
					{
						$match: {
							date: {
								$gte: startDate,
								$lte: endDate,
							},
							branch: currentBranch._id,
							listInputDat: { $in: listInputDatsIndexes },
						},
					},
					{
						$lookup: {
							from: "listinputdats",
							localField: "listInputDat",
							foreignField: "_id",
							as: "listInputDatDetails",
						},
					},
					{
						$unwind: {
							path: "$listInputDatDetails",
							preserveNullAndEmptyArrays: true, // Conservar los documentos incluso si no hay correspondencia en el lookup.
						},
					},
					{
						$addFields: {
							name: "$listInputDatDetails.name",
							measurement: "$listInputDatDetails.measurement",
						},
					},
					{
						$project: {
							listInputDatDetails: 0,
						},
					},
				]);

				if (inputDatValues.length === 0) {
					monthValues.push(monthValue);
				} else {
					const value = getValue(
						currentIndicator.name,
						inputDatValues
					);
					if (value === undefined)
						throw new Error(
							"Error al obtener el valor del indicador"
						);
					monthValue.value = value;
					monthValues.push(monthValue);
				}
			}
		} else {
			const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
			const endDate = new Date(year, month, 0, 23, 59, 59, 999);
			const monthValue: {
				year: number;
				month: string;
				index: number;
				value: GetValueResult;
			} = {
				year: year,
				month: getMonthName(month),
				index: month,
				value: {
					result: -1,
					details: {},
				},
			};
			const inputDatsValues = await InputDatsModel.aggregate([
				{
					$match: {
						listInputDat: { $in: listInputDatsIndexes },
						date: {
							$gte: startDate,
							$lte: endDate,
						},
						branch: currentBranch._id,
					},
				},
				{
					$lookup: {
						from: "listinputdats",
						localField: "listInputDat",
						foreignField: "_id",
						as: "listInputDatDetails",
					},
				},
				{
					$unwind: {
						path: "$listInputDatDetails",
						preserveNullAndEmptyArrays: true, // Conservar los documentos incluso si no hay correspondencia en el lookup.
					},
				},
				{
					$addFields: {
						name: "$listInputDatDetails.name",
					},
				},
				{
					$project: {
						listInputDatDetails: 0,
					},
				},
			]);
			if (inputDatsValues.length === 0) {
				monthValues.push(monthValue);
			} else {
				const value = getValue(currentIndicator.name, inputDatsValues);
				if (value === undefined)
					throw new Error("Error al obtener el valor del indicador");
				monthValue.value = value;
				monthValues.push(monthValue);
			}
		}
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener el valor del indicador");
	}
};

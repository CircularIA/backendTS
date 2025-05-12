import {
	getIndicatorInfoService,
	getIndicatorsService,
	getIndicatorValueService,
} from "@src/services/indicatorServices";
import { Request, Response } from "express";

interface IndicatorParams {
	branchId: string;
	indicatorId: string;
	year: number;
	month?: number;
}

export const getIndicators = (
	req: Request<Pick<IndicatorParams, "branchId">>,
	res: Response
) => {
	try {
		const { branchId } = req.params;
		const indicators = getIndicatorsService(branchId);
		res.status(200).json(indicators);
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

export const getIndicatorInfo = async (
	req: Request<Pick<IndicatorParams, "indicatorId">>,
	res: Response
) => {
	try {
		const { indicatorId } = req.params;
		const indicatorInfo = await getIndicatorInfoService(indicatorId);
		return res.status(200).json(indicatorInfo);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
};

export const getIndicatorValue = (
	req: Request<IndicatorParams>,
	res: Response
) => {
	try {
		const { branchId, indicatorId, year, month } = req.params;
		const indicatorValue = getIndicatorValueService(
			branchId,
			indicatorId,
			year,
			month
		);
		res.status(200).json(indicatorValue);
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

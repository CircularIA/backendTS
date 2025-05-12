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

export const getInputDats = async (req: Request, res: Response) => {
	try {
		const { branch, year, month, day } = req.params;
		const inputDats = await getInputDatsService(
			branch,
			Number(year),
			Number(month),
			Number(day)
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
	inputDats: z.array(inputDatSchema),
});

export const registerInputDatsMany = async (req: Request, res: Response) => {
	try {
		const { company, branch } = req.params;
		const { user } = req.user;
		const parsed = registerInputDatManySchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: parsed.error.message });
		}
		const { inputDats } = parsed.data;
		const savedInputDats = await registerInputDatsManyService(
			company,
			branch,
			inputDats,
			user.id
		);
		return res.status(200).json(savedInputDats);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
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

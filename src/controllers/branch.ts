import { getBranch } from "@src/services/branchServices";
import { Request, Response } from "express";

export const getBranches = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user } = req.user;
		const branches = await getBranch(user._id);
		return res.status(200).json(branches);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

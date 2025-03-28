import { getCompany } from "@src/services/companyService";
import { Request, Response } from "express";

export const getCompanies = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { user } = req.user;
		const company = await getCompany(user);
		return res.status(200).json(company);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

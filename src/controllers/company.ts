import { getCompany } from "@src/services/companyServices";
import { Request, Response } from "express";

export const getCompanies = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		console.log("entro en el controlador");
		const user = req.user;
		console.log("user", user);
		const company = await getCompany(user);
		return res.status(200).json(company);
	} catch (error) {
		console.log("error in getCompanies controller", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

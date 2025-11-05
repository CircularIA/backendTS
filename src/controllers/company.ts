import { createCompanySchema } from "@src/schemas/companies/companySchema";
import {
	assignNewUserToCompanyBranches,
	createCompanyService,
	createFirstBranchForCompanyService,
	getCompany,
} from "@src/services/companyServices";
import { createAdminUser } from "@src/services/userServices";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const getCompanies = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const user = req.user;
		const company = await getCompany(user);
		return res.status(200).json(company);
	} catch (error) {
		console.log("error in getCompanies controller", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const createCompany = async (
	req: Request,
	res: Response
): Promise<Response> => {
	console.log("enter in createCompany controller");
	try {
		const parsed = createCompanySchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({
				message: "Invalid request data",
				errors: parsed.error.errors,
			});
		}
		const companyData = parsed.data;
		//If the admin user is sent in the request, use it. Otherwise, create a new user as admin
		let adminUser = companyData.admin || undefined;
		//First create the company without admin if not provided
		const newCompany = await createCompanyService({
			...companyData,
			admin: adminUser,
		});
		//Then create the admin user if not provided
		if (!companyData.admin) {
			//Create a new user as admin
			const newUser = await createAdminUser({
				username: `${companyData.name} Admin`,
				email: companyData.email,
				password: "defaultpassword",
				company: newCompany._id.toString(),
			});
			console.log("Created new admin user for company:", newUser);
			adminUser = newUser._id.toString();
			//Update the company with the new admin user
			newCompany.admin = newUser._id;
			await newCompany.save();
		}
		console.log("admin user id:", adminUser);
		//Call the service

		//Create the branch and assign to the company
		const newBranchedAssigned = await createFirstBranchForCompanyService(
			companyData.rut
		);
		//Assign the user to the branch
		await assignNewUserToCompanyBranches(new Types.ObjectId(adminUser), [
			newBranchedAssigned._id,
		]);
		return res.status(201).json({
			message: "Company and main branch created successfully",
			company: newCompany,
			branch: newBranchedAssigned,
		});
	} catch (error) {
		console.log("error in createCompany controller", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

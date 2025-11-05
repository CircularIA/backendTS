import { CONFIG } from "../config/index";
import { Request, Response } from "express";
import {
	createAdminUser,
	createRegularUser,
	createSuperAdminUser,
	createThemeUser,
} from "@src/services/userServices";
import {
	createAdminSchema,
	createRegularUserSchema,
} from "@src/schemas/user/userSchema";

import { getUsersByBranch } from "@src/services/userServices";

export const getUsersByBranchController = async (
	req: Request,
	res: Response
) => {
	try {
		const { branchId } = req.params;
		const users = await getUsersByBranch(branchId);
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch users by branch" });
	}
};

export const createSuperAdmin = async (req: Request, res: Response) => {
	try {
		const { username, email, password, secretKey } = req.body;
		if (secretKey !== CONFIG.SECRET_KEY) {
			return res.status(401).json({ message: "Invalid secret key" });
		} else {
			const user = await createSuperAdminUser({
				username,
				email,
				password,
			});

			return res
				.status(201)
				.json({ message: "Super Admin created successfully", user });
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createAdmin = async (req: Request, res: Response) => {
	try {
		const parsed = createAdminSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid data" });
		}
		const { username, email, password, company } = parsed.data;

		const user = await createAdminUser({
			username,
			email,
			password,
			company,
		});

		return res
			.status(201)
			.json({ message: "Admin created successfully", user });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const parsed = createRegularUserSchema
			.omit({ role: true, permissions: true })
			.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid data" });
		}
		const { username, email, password, company, branch } = parsed.data;
		//First instance definy the whole branch to the user
		const user = await createRegularUser({
			username,
			email,
			password,
			company,
			branch,
		});

		return res
			.status(201)
			.json({ message: "User created successfully", user });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createAmbientalUser = async (req: Request, res: Response) => {
	try {
		const { username, email, password, company, branch } = req.body;
		const user = await createThemeUser(
			{
				username,
				email,
				password,
				company,
				branch,
			},
			"AMBIENTAL"
		);
		return res
			.status(201)
			.json({ message: "User created successfully", user });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createEconomicUser = async (req: Request, res: Response) => {
	try {
		const { username, email, password, company, branch } = req.body;
		const user = await createThemeUser(
			{
				username,
				email,
				password,
				company,
				branch,
			},
			"ECONOMIC"
		);
		return res
			.status(201)
			.json({ message: "User created successfully", user });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const createSocialUser = async (req: Request, res: Response) => {
	try {
		const { username, email, password, company, branch } = req.body;
		const user = await createThemeUser(
			{
				username,
				email,
				password,
				company,
				branch,
			},
			"SOCIAL"
		);
		return res
			.status(201)
			.json({ message: "User created successfully", user });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

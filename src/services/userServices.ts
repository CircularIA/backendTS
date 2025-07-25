import { CONFIG } from "@src/config";
import { NotFoundError } from "@src/errors/NotFoundError";
import { USER_ROLES } from "@src/middlewares/roles";
import Branch from "@src/models/Branches";
import CompanyModel from "@src/models/Company";
import UserModel from "@src/models/Users";
import {
	createRegularUserSchema,
	createThemeUserSchema,
	userEntitySchema,
} from "@src/schemas/user/userSchema";
import {
	generatePermissionByRole,
	IndicatorsType,
	RoleType,
} from "@src/types/permission.types";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { createSalt } from "@src/utils/bcrypt";

export const getUsers = async () => {
	try {
		const users = await UserModel.find();
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw new Error("Failed to fetch users");
	}
};

export const getUserById = async (userId: string) => {
	try {
		const user = await UserModel.findById(userId);
		return user;
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		throw new Error("Failed to fetch user by ID");
	}
};

export const getUsersByBranch = async (branchId: string) => {
	try {
		const branch = await Branch.findById(branchId).populate(
			"assignedUsers"
		);
		if (!branch) throw new Error("Branch not found");
		return branch.assignedUsers;
	} catch (error) {
		console.error("Error fetching users by branch:", error);
		throw new Error("Failed to fetch users by branch");
	}
};

export const createSuperAdminUser = async (userData: any) => {
	console.log("Creating super admin user");
	try {
		const validatedData = userEntitySchema
			.omit({
				_id: true,
				permissions: true,
				company: true,
				indicators: true,
				role: true,
				branches: true,
			})
			.parse(userData);
		console.log("Salt Config", CONFIG.SALT);
		console.log("type of the salt config", typeof CONFIG.SALT);
		const hashedPassword = await bcrypt.hash(
			validatedData.password,
			Number(CONFIG.SALT)
		);
		const newUser = new UserModel({
			_id: new mongoose.Types.ObjectId(),
			...validatedData,
			password: hashedPassword,
			role: USER_ROLES.SUPER_ADMIN,
			permissions: generatePermissionByRole("SUPER_ADMIN"),
		});

		await newUser.save();
		return newUser;
	} catch (error) {
		console.error("Error creating super admin user:", error);
		throw new Error("Failed to create super admin user");
	}
};

export const createAdminUser = async (
	username: string,
	email: string,
	password: string,
	company: string
) => {
	console.log("enter in the service");
	try {
		const hashedPassword = await bcrypt.hash(password, Number(CONFIG.SALT));

		const newUser = new UserModel({
			_id: new mongoose.Types.ObjectId(),
			username,
			email,
			company,
			password: hashedPassword,
			role: USER_ROLES.ADMIN,
			permissions: generatePermissionByRole("ADMIN"),
		});

		await newUser.save();
		return newUser;
	} catch (error) {
		console.error("Error creating admin user:", error);
		throw new Error("Failed to create admin user");
	}
};

export const createRegularUser = async (userData: any) => {
	try {
		const validatedData = createRegularUserSchema.parse(userData);

		const hashedPassword = await bcrypt.hash(
			validatedData.password,
			createSalt()
		);
		const companyModel = await CompanyModel.findById(validatedData.company);
		if (!companyModel) {
			throw new NotFoundError("Company not found");
		}
		const branchModel = await Branch.findById(validatedData.branch);
		if (!branchModel) {
			throw new NotFoundError("Branch not found");
		}
		const newID = new mongoose.Types.ObjectId();
		const newUser = new UserModel({
			_id: newID,
			...validatedData,
			branches: [companyModel.branches],
			password: hashedPassword,
			role: USER_ROLES.USER,
			permissions: generatePermissionByRole("USER"),
		});

		await newUser.save();
		//Have to add the new user to the branch
		// await assignNewUserToCompanyBranches(newID, companyModel.branches);
		await Branch.findByIdAndUpdate(validatedData.branch, {
			$push: { assignedUsers: newUser._id },
		});
		return newUser;
	} catch (error) {
		console.error("Error creating user:", error);
		throw new Error("Failed to create user");
	}
};

export const createThemeUser = async (userData: any, type: IndicatorsType) => {
	try {
		const validatedData = createThemeUserSchema.parse(userData);

		let role = USER_ROLES.USER;
		let permission: RoleType = "USER";
		if (type === "AMBIENTAL") {
			role = USER_ROLES.AMBIENTAL_USER;
			permission = "AMBIENTAL_USER";
		} else if (type === "SOCIAL") {
			role = USER_ROLES.SOCIAL_USER;
			permission = "SOCIAL_USER";
		} else {
			role = USER_ROLES.ECONOMIC_USER;
			permission = "ECONOMIC_USER";
		}
		console.log("permissions of the theme user", permission);
		console.log("config salt", CONFIG.SALT);

		const hashedPassword = await bcrypt.hash(
			validatedData.password,
			createSalt()
		);
		const newUser = new UserModel({
			...validatedData,
			_id: new mongoose.Types.ObjectId(),
			password: hashedPassword,
			role: role,
			permissions: generatePermissionByRole(permission),
			branches: [validatedData.branch],
		});
		await newUser.save();
		console.log("new user created", newUser);
		//Have to add the new user to the branch
		await Branch.findByIdAndUpdate(validatedData.branch, {
			$push: { assignedUsers: newUser._id },
		});
		// await assignNewUserToCompanyBranches(newID, validatedData.branches);
		console.log("new user added to branch");
		return newUser;
	} catch (error) {
		console.error("Error creating theme user:", error);
		throw new Error("Failed to create theme user");
	}
};

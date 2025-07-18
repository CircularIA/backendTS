import User from "@src/models/Users";
import { NotFoundError } from "@src/errors/NotFoundError";
import { ServiceError } from "@src/errors/ServiceError";
import Branch from "@src/models/Branches";
import CompanyModel from "@src/models/Company";
import { Types } from "mongoose";

export const getBranch = async (userId: string) => {
	try {
		const findUser = await User.findById(userId).populate("company");
		if (!findUser) {
			throw new Error("Usuario no encontrado");
		} else {
			if (findUser.role === "super_admin") {
				const branches = await Branch.find();
				return branches;
			} else if (findUser.role === "admin") {
				const companyUser = findUser.company;
				//*Have to definy the company model
				const dataCompany = await CompanyModel.findById(
					companyUser
				).populate("branches");
				if (!dataCompany) {
					throw new Error("Compañía no encontrada");
				}
				return dataCompany.branches;
			} else {
				const branches = await Branch.find({ assignedUsers: userId });
				return branches;
			}
		}
	} catch (error) {
		console.error("error", error);
		throw new Error("Error al obtener las sucursales");
	}
};

export const assignNewUserToBranch = async (
	userId: Types.ObjectId,
	branchId: string
) => {
	try {
		const branch = await Branch.findById(branchId);
		if (!branch) throw new NotFoundError("Sucursal no encontrada");
		if (!branch.assignedUsers.includes(userId)) {
			branch.assignedUsers.push(userId);
			await branch.save();
		} else {
			throw new ServiceError(
				"El usuario ya está asignado a esta sucursal",
				null
			);
		}
		return branch;
	} catch (error) {
		console.error("Error in assigned New USer to branch", error);
		throw new ServiceError(
			"Error al asignar un usuario a la sucursal",
			error
		);
	}
};

import User from "@models/Users";
import { USER_ROLES } from "@src/middlewares/roles";
import Company from "@src/models/Company";

export const getCompany = async (userId: string) => {
	try {
		const findUser = await User.findById(userId).populate("company");
		if (!findUser) {
			throw new Error("User not found");
		} else {
			if (findUser.role === USER_ROLES.SUPER_ADMIN) {
				const companies = await Company.find().populate("branches");
				return companies;
			} else if (findUser.role === USER_ROLES.ADMIN) {
				const findCompany = await Company.findById(
					findUser.company?._id
				).populate("branches");
				if (!findCompany) {
					throw new Error("Company not found");
				}
				return findCompany;
			} else if (findUser.role === USER_ROLES.USER) {
				const findCompany = await Company.findById(
					findUser.company?._id
				).populate("branches");
				return findCompany;
			} else {
				throw new Error("User role not valid");
			}
		}
	} catch (error) {
		console.error("Error al obtener las sucursales:", error);
		throw new Error("Error al obtener las sucursales");
	}
};

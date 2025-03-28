import User from "@models/Users";
import Branch from "@src/models/Branches";
import CompanyModel from "@src/models/Company";

export const getBranch = async (userId: string) => {
	try {
		const findUser = await User.findById(userId).populate("company");
		if (!findUser) {
			return findUser;
		} else {
			if (findUser?.role === "super_admin") {
				const branches = await Branch.find();
				return branches;
			} else if (findUser.role === "admin") {
				const companyUser = findUser.company;
				//*Have to definy the company model
				const dataCompany = await CompanyModel.findById(
					companyUser
				).populate("branches");
				return dataCompany?.branches;
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

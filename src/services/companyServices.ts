import { CreateCompanySchema } from "./../schemas/companies/companySchema";
import User from "@src/models/Users";
import { ServiceError } from "@src/errors/ServiceError";
import { USER_ROLES } from "@src/middlewares/roles";
import { Types } from "mongoose";
import { assignNewUserToBranch } from "./branchServices";
import { CreateBranchSchema } from "@src/schemas/branches/branchSchema";
import BranchModel from "@src/models/Branches";
import CompanyModel from "@src/models/Company";

export const getCompany = async (userId: string) => {
	try {
		const findUser = await User.findById(userId).populate("company");
		if (!findUser) {
			throw new Error("User not found");
		} else {
			if (findUser.role === USER_ROLES.SUPER_ADMIN) {
				const companies = await CompanyModel.find().populate({
					path: "branches",
					populate: {
						path: "manager",
						select: "username email", // Solo selecciona los campos que necesitas
					},
				});

				// Transformar para agregar managerName
				const companiesWithManagerName = companies.map((company) => {
					const companyObj = company.toObject();
					companyObj.branches = companyObj.branches.map(
						(branch: any) => ({
							...branch,
							managerName: branch.manager?.username || "Unknown",
						})
					);
					return companyObj;
				});

				return companiesWithManagerName;
			} else if (findUser.role === USER_ROLES.ADMIN) {
				const findCompany = await CompanyModel.findById(
					findUser.company?._id
				).populate({
					path: "branches",
					populate: {
						path: "manager",
						select: "username email",
					},
				});

				if (!findCompany) {
					throw new Error("Company not found");
				}

				// Transformar para agregar managerName
				const companyObj = findCompany.toObject();
				companyObj.branches = companyObj.branches.map(
					(branch: any) => ({
						...branch,
						managerName: branch.manager?.username || "Unknown",
					})
				);

				return companyObj;
			} else if (findUser.role === USER_ROLES.USER) {
				const findCompany = await CompanyModel.findById(
					findUser.company?._id
				).populate({
					path: "branches",
					populate: {
						path: "manager",
						select: "username email",
					},
				});

				if (!findCompany) {
					throw new Error("Company not found");
				}

				// Transformar para agregar managerName
				const companyObj = findCompany.toObject();
				companyObj.branches = companyObj.branches.map(
					(branch: any) => ({
						...branch,
						managerName: branch.manager?.username || "Unknown",
					})
				);

				return companyObj;
			} else {
				throw new Error("User role not valid");
			}
		}
	} catch (error) {
		console.error("Error al obtener las sucursales:", error);
		throw new Error("Error al obtener las sucursales");
	}
};

export const createCompanyService = async (data: CreateCompanySchema) => {
	try {
		const existingCompany = await CompanyModel.findOne({
			$or: [{ rut: data.rut }, { email: data.email }],
		});
		if (existingCompany) {
			throw new ServiceError(
				"Company with given RUT or email already exists"
			);
		}
		const newCompany = new CompanyModel({
			_id: new Types.ObjectId(),
			...data,
			branches: [],
		});
		await newCompany.save();
		return newCompany;
	} catch (error) {
		console.error("Error in registerCompany:", error);
		throw new ServiceError("Error al registrar la compañia", error);
	}
};

export const createFirstBranchForCompanyService = async (
	rutCompany: CreateCompanySchema["rut"]
) => {
	try {
		const company = await CompanyModel.findOne({ rut: rutCompany });
		if (!company) {
			throw new ServiceError("Company not found");
		}
		//Create the first branch
		const initialBranch: CreateBranchSchema = {
			_id: new Types.ObjectId().toString(),
			name: "Sucursal Principal",
			description: "Sucursal principal de la compañia",
			address: company.address,
			phone: company.phone || "N/A",
			email: company.email,
			company: company._id.toString(),
			...(company.admin ? { manager: company.admin.toString() } : {}),
		};
		const newBranch = new BranchModel(initialBranch);
		await newBranch.save();
		//Add the branch to the company
		company.branches.push(newBranch._id);
		await company.save();
		return newBranch;
	} catch (error) {
		console.error("Error in createFirstBranchForCompanyService:", error);
		throw new ServiceError("Error al crear la primera sucursal", error);
	}
};

export const assignNewUserToCompanyBranches = async (
	userId: Types.ObjectId,
	companyBranches: Types.ObjectId[]
) => {
	try {
		const promiseArray = companyBranches.map(async (branchId) =>
			assignNewUserToBranch(userId, branchId.toString())
		);
		//Execute all promises in parallel
		await Promise.all(promiseArray);
		return true;
	} catch (error) {
		console.error("Error in assignNewUserToCompanyBranches", error);
		throw new ServiceError(
			"Error al asignar un usuario a las sucursales de la compañia",
			error
		);
	}
};

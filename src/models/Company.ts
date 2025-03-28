import { TypeIndustry } from "@src/types/company.types";
import { model, Schema, Types } from "mongoose";

interface ICompany extends Document {
	_id: Types.ObjectId;
	rut: string;
	name: string;
	email: string;
	imagen?: string;
	description?: string;
	region: string;
	address: string;
	phone?: string;
	size?: number;
	typeIndustry?: TypeIndustry;
	employees?: number;
	admin: Types.ObjectId;
	branches: Types.ObjectId[];
}

const companySchema = new Schema<ICompany>({
	_id: Schema.Types.ObjectId,
	rut: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	imagen: { type: String, required: false },
	description: { type: String, required: false },
	region: { type: String, required: true },
	address: { type: String, required: true },
	phone: { type: String, required: false },
	size: { type: Number, required: false },
	typeIndustry: { type: String, required: false },
	employees: { type: Number, required: false },
	admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
	branches: [{ type: Schema.Types.ObjectId, ref: "Branch" }],
});

const CompanyModel = model("Company", companySchema);

export default CompanyModel;

import { model, Schema, Types } from "mongoose";

interface IBranch extends Document {
	_id: Types.ObjectId;
	name: string;
	description: string;
	address: string;
	phone: string;
	email: string;
	status: boolean;
	company: Types.ObjectId;
	manager?: Types.ObjectId;
	inputDats: Types.ObjectId[];
	assignedUsers: Types.ObjectId[];
}

const branchSchema = new Schema<IBranch>(
	{
		_id: Schema.Types.ObjectId,
		name: { type: String, required: [true, "Name is required"] },
		description: { type: String },
		address: { type: String },
		phone: { type: String },
		email: { type: String },
		status: { type: Boolean, default: true },
		//Persona responsable de la sucursal
		company: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: [true, "Company is required"],
		},
		manager: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [false],
		},
		//Indicadores de la sucursal
		inputDats: [
			{
				type: Schema.Types.ObjectId,
				ref: "ListInputDat",
			},
		],

		//Users assigned to the branch
		assignedUsers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

const BranchModel = model("Branch", branchSchema);

export default BranchModel;

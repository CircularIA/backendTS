import { USER_ROLES } from "@src/middlewares/roles";
import { model, Schema, Types } from "mongoose";

interface UserInputDat {
	username: string;
	email: string;
	role: USER_ROLES;
}

export interface IInputDats extends Document {
	_id: Types.ObjectId;
	value: number;
	date: Date;
	listInputDat: Types.ObjectId;
	company: Types.ObjectId;
	branch: Types.ObjectId;
	user: UserInputDat;
}

const InputDatsSchema = new Schema<IInputDats>(
	{
		_id: Schema.Types.ObjectId,
		value: { type: Number, required: true },
		date: { type: Date, required: true, default: new Date() },
		listInputDat: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "ListInputDat",
		},
		company: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Company",
		},
		branch: { type: Schema.Types.ObjectId, required: true, ref: "Branch" },
		user: { type: Object, required: true },
	},
	{ timestamps: true }
);

const InputDatsModel = model<IInputDats>("InputDats", InputDatsSchema);

export default InputDatsModel;

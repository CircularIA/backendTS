import { Schema, Types, model } from "mongoose";

const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	permissions: [
		{
			type: Types.ObjectId,
			ref: "Permission",
		},
	],
});

const Role = model("Role", roleSchema);

export default Role;

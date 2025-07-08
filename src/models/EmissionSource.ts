import { model, Schema, Types } from "mongoose";

interface IEmissionSource extends Document {
	_id: Types.ObjectId;
	type_emission: 0;
	name: string;
	description: string;
	company: Types.ObjectId;
	branch: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

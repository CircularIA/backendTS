import { Measurements } from "@src/types/common.types";
import {
	SourceEmissionDirect,
	SourceEmissionIndirect,
	SourceEmissionOther,
	TypeEmission,
} from "@src/types/emissionSource.types";
import { model, Schema, Types } from "mongoose";

interface IEmissionSource extends Document {
	_id: Types.ObjectId;
	type_emission: TypeEmission;
	source_emission:
		| SourceEmissionDirect
		| SourceEmissionIndirect
		| SourceEmissionOther;
	detail_emission: string;
	//Info of the company and the branch
	company: Types.ObjectId;
	branch: Types.ObjectId;
	user: Types.ObjectId;
	//Info of the foot print numbers
	measurement: Measurements;
	quantity: number;
	//Files of evidence
	files: File[] | File;
	//Metrics to calculate the footprint
	emission_factor: number;
	unit_factor: string;
	origin_factor: string;
}

const emissionSourceSchema = new Schema<IEmissionSource>(
	{
		_id: Schema.Types.ObjectId,
		type_emission: { type: String, required: true },
		source_emission: { type: String, required: true },
		detail_emission: { type: String, required: true },
		company: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		measurement: { type: String, required: true },
		quantity: { type: Number, required: true },
		files: { type: [Schema.Types.Mixed], required: true },
		emission_factor: { type: Number, required: true },
		unit_factor: { type: String, required: true },
		origin_factor: { type: String },
	},
	{ timestamps: true }
);

const EmissionSourceModel = model<IEmissionSource>(
	"EmissionSource",
	emissionSourceSchema
);

export default EmissionSourceModel;

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
	createdAt: Date;
	updatedAt: Date;
}

import { IndicatorCategories, SourcesTypes } from "@src/types/indicator.types";
import { model, Schema, Types } from "mongoose";

interface IIndicators extends Document {
	_id: Types.ObjectId;
	name: string;
	source: string;
	category: IndicatorCategories;
	sourceType: SourcesTypes;
	description: string;
	measurement: string;
	inputDats: Types.ObjectId[];
}

const indicatorSchema = new Schema<IIndicators>(
	{
		_id: Schema.Types.ObjectId,
		name: { type: String, required: [true, "Name is required"] },
		source: { type: String, required: [true, "Source is required"] },
		category: { type: String, required: [true, "Category is required"] },
		sourceType: {
			type: String,
			required: [true, "Source type is required"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
		measurement: {
			type: String,
			required: [true, "Measurement is required"],
		},
		inputDats: [{ type: Schema.Types.ObjectId, ref: "InputDats" }],
	},
	{
		timestamps: true,
	}
);

const IndicatorModel = model<IIndicators>("Indicators", indicatorSchema);

export default IndicatorModel;

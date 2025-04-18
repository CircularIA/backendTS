import {
	Ecoquivalence,
	IndicatorCategories,
	Norm,
	SubCategorie,
} from "@src/types/indicator.types";
import { model, Schema, Types } from "mongoose";

interface IListInputDats extends Document {
	_id: Types.ObjectId; // Agregar el campo _id
	name: string;
	description: string;
	measurement: string;
	category: IndicatorCategories;
	norms: Norm[];
	ecoequivalence: Ecoquivalence;
	subcategory: SubCategorie;
}

const ListInputDatsSchema = new Schema<IListInputDats>({
	_id: Schema.Types.ObjectId,
	name: { type: String, required: true },
	description: { type: String },
	measurement: { type: String },
	category: { type: String, required: true },
	norms: { type: [Object], required: true },
	ecoequivalence: { type: Object, required: true },
	subcategory: { type: String, required: true },
});

const ListInputDatsModel = model<IListInputDats>(
	"ListInputDats",
	ListInputDatsSchema
);

export default ListInputDatsModel;

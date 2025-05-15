import { z } from "zod";
import { objectIdSchema } from "../common/zodObjectId";
import {
	IndicatorCategoriesList,
	SourcesTypesList,
} from "@src/types/indicator.types";

export const IndicatorCategoriesEnum = z.enum(IndicatorCategoriesList);
export const SourcesTypesEnum = z.enum(SourcesTypesList);

// Indicator schema
const indicatorSchema = z.object({
	_id: objectIdSchema,
	name: z.string().min(1, { message: "Name is required" }),
	source: z.string().min(1, { message: "Source is required" }),
	category: IndicatorCategoriesEnum,
	sourceType: SourcesTypesEnum,
	description: z.string().min(1, { message: "Description is required" }),
	measurement: z.string().min(1, { message: "Measurement is required" }),
	inputDats: z.array(objectIdSchema),
});

export type IndicatorDto = z.infer<typeof indicatorSchema>;
export { indicatorSchema };

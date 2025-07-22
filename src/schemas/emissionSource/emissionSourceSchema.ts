import { objectIdRegex } from "@src/constants/schema";
import { z } from "zod";

export const emissionSourceSchema = z.object({
	id: z.string().regex(objectIdRegex, "Invalid ObjectId"), // Optional because it might not be present when creating a new emission source
	type_emission: z.string(),
	source_emission: z.string(),
	detail_emission: z.string(),
	company: z.string().regex(objectIdRegex, "Invalid ObjectId"),
	branch: z.string().regex(objectIdRegex, "Invalid ObjectId"),
	user: z.string().regex(objectIdRegex, "Invalid ObjectId"),
	measurement: z.string(),
	quantity: z.number(),
	files: z.instanceof(File).array().optional(), // Optional because it might not be present when creating a new emission source
	emission_factor: z.number(),
	unit_factor: z.string(),
	origin_factor: z.string(),
});

export type EmissionSource = z.infer<typeof emissionSourceSchema>;

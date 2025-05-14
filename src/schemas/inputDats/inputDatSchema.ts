import { z } from "zod";
import { userRolesEnum } from "../common/userRolesEnum";

const userInputDatSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	role: userRolesEnum,
});

export const inputDatSchema = z.object({
	_id: z
		.string()
		.regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")
		.optional(),
	value: z.number(),
	date: z.preprocess((val) => new Date(val as string), z.date()),
	listInputDat: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
	company: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
	branch: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
	user: userInputDatSchema,
});

export type InputDatDTO = z.infer<typeof inputDatSchema>;

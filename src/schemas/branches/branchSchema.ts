import { z } from "zod";
import { objectIdRegex } from "@src/constants/schema";

export const branchEntitySchema = z.object({
	_id: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	name: z.string(),
	description: z.string(),
	address: z.string(),
	phone: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	status: z.boolean(),
	company: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	manager: z
		.string()
		.regex(objectIdRegex, { message: "Invalid ObjectId" })
		.optional(),
	inputDats: z.array(
		z.string().regex(objectIdRegex, { message: "Invalid ObjectId" })
	),
	assignedUsers: z.array(
		z.string().regex(objectIdRegex, { message: "Invalid ObjectId" })
	),
});

export type BranchEntity = z.infer<typeof branchEntitySchema>;

//Schema for branch creation
export const createBranchSchema = branchEntitySchema.pick({
	_id: true,
	name: true,
	description: true,
	address: true,
	phone: true,
	email: true,
	company: true,
	manager: true,
});

export type CreateBranchSchema = z.infer<typeof createBranchSchema>;

import { z } from "zod";
import { objectIdRegex } from "@src/constants/schema";

export const companyEntitySchema = z.object({
	_id: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	rut: z.string(),
	name: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	imagen: z.string().optional(),
	description: z.string().optional(),
	region: z.string(),
	address: z.string(),
	phone: z.string().optional(),
	size: z.number().optional(),
	typeIndustry: z.string().optional(),
	employees: z.number().optional(),
	admin: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	branches: z.array(
		z.string().regex(objectIdRegex, { message: "Invalid ObjectId" })
	),
});

export type CompanyEntity = z.infer<typeof companyEntitySchema>;

//Schema for company creation
export const createCompanySchema = companyEntitySchema
	.pick({
		rut: true,
		name: true,
		typeIndustry: true,
		address: true,
		region: true,
		size: true,
		employees: true,
		email: true,
	})
	.extend({
		admin: companyEntitySchema.shape.admin.optional(),
	});

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

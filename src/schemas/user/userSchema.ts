import { z } from "zod";
import { objectIdRegex } from "@src/constants/schema";
import { USER_ROLES } from "@src/middlewares/roles";

export const userEntitySchema = z.object({
	_id: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	username: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	resetPasswordToken: z.string().optional(),
	resetPasswordExpires: z.date().optional(),
	company: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	//Type of the user
	role: z.nativeEnum(USER_ROLES).default(USER_ROLES.USER),
	permissions: z.array(z.string()),
	active: z.boolean().default(true),
	indicators: z.array(
		z.object({
			_id: z
				.string()
				.regex(objectIdRegex, { message: "Invalid ObjectId" }), // Simula el ref a "Indicator"
			sourceType: z.array(z.string()), // Array de strings
			active: z.boolean().default(true), // Booleano con valor por defecto

			activeRegisters: z.array(
				z.object({
					date: z.date().default(new Date()), // Fecha con valor por defecto
					value: z.boolean().default(true), // Booleano con valor por defecto
					user: z.object({
						name: z.string().optional(), // Nombre opcional
						email: z.string().email().optional(), // Email opcional con validación
					}),
				})
			),
		})
	),
	branches: z.array(
		z.object({
			_id: z
				.string()
				.regex(objectIdRegex, { message: "Invalid ObjectId" }),
		})
	),
});

export type UserEntity = z.infer<typeof userEntitySchema>;

//Schemas for the user creation

export const createAdminSchema = z.object({
	username: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	company: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	//Type of the user
	role: z.nativeEnum(USER_ROLES).default(USER_ROLES.ADMIN),
	permissions: z.array(z.string()),
});

export const createRegularUserSchema = z.object({
	username: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	company: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	branch: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	//Type of the user
	role: z.nativeEnum(USER_ROLES).default(USER_ROLES.USER),
	permissions: z.array(z.string()),
});

export const createThemeUserSchema = z.object({
	username: z.string(),
	email: z.string().email({ message: "Invalid email format" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	company: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
	branch: z.string().regex(objectIdRegex, { message: "Invalid ObjectId" }),
});

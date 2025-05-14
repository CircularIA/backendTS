import { z } from "zod";

// Reutilizable para validar ObjectIds
export const objectIdSchema = z
	.string()
	.regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

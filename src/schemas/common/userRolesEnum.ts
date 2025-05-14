import { USER_ROLES } from "@src/middlewares/roles";
import { z } from "zod";

// Enum equivalente a USER_ROLES (asumiendo estos valores como ejemplo)
export const userRolesEnum = z.enum([
	...(Object.values(USER_ROLES) as [string, ...string[]]),
]);

// middlewares/checkPermission.ts
import {
	Actions,
	ActionsType,
	createFormatPermission,
	getResourceByRole,
	RoleType,
} from "@src/types/permission.types";
import { Request, Response, NextFunction } from "express";

interface PermissionOptions {
	action: ActionsType;
	resourceOverride?: string; // opcional, para recursos específicos si se desea forzar
}

export const checkPermissionByRole = ({
	action,
	resourceOverride,
}: PermissionOptions) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user;
		if (!user || !user.role || !user.permissions) {
			return res.status(401).json({ message: "No autorizado" });
		}

		// Determinar el recurso según el rol, o usar override si lo mandan explícito
		const role = user.role as RoleType;
		const resource = resourceOverride || getResourceByRole(role);

		if (!resource) {
			return res.status(403).json({
				message: "No se pudo determinar el recurso para el rol",
			});
		}

		const permissionToCheck = createFormatPermission(resource, action);

		if (
			user.permissions.includes(permissionToCheck) ||
			user.permissions.includes(`${resource}:${Actions.MANAGE}`)
		) {
			return next();
		}

		return res
			.status(403)
			.json({ message: "No tienes permiso para realizar esta acción" });
	};
};

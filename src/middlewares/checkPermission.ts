import { Actions } from "@src/types/permission.types";
import { NextFunction, Request, Response } from "express";

type PermissionInput = string | ((req: Request) => string);

export const checkPermission = (permissionInput: PermissionInput) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const permission =
			typeof permissionInput === "function"
				? permissionInput(req)
				: permissionInput;

		const user = (req as any).user;

		console.log("user.permissions", user.permissions);
		console.log("permission", permission);

		const resource = permission.split(":")[0];

		if (user && user.permissions) {
			if (user.permissions.includes(permission)) {
				next();
			} else if (
				user.permissions.includes(`${resource}:${Actions.MANAGE}`) &&
				resource !== undefined
			) {
				next();
			} else {
				res.status(403).json({
					message: "No tienes permiso para realizar esta acción",
				});
			}
		} else {
			res.status(500).json({ message: "Error interno del servidor" });
		}
	};
};

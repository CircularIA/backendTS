import { Actions } from "@src/types/permission.types";
import { NextFunction, Request, Response } from "express";

export const checkPermission = (permission: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user; // Suponiendo que el usuario está adjunto al objeto req
		console.log("user.permissions", user.permissions);
		const resource = permission.split(":")[0];
		if (user && user.permissions) {
			if (user.permissions.includes(permission)) {
				next();
			} else if (
				user.permissions.includes(`${resource}:${Actions.MANAGE}`) &&
				resource != undefined
			) {
				//If the user has the permission to manage the resource, allow access
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

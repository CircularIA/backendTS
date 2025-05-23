import UserModel from "@src/models/Users";
import { NextFunction, Request, Response } from "express";

export const checkPermission = (permission: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user; // Suponiendo que el usuario está adjunto al objeto req
		console.log("user", user);
		console.log("permission", permission);
		console.log("user.permissions", user.permissions);
		if (user && user.permissions && user.permissions.includes(permission)) {
			next();
		} else {
			res.status(403).json({
				message: "No tienes permiso para realizar esta acción",
			});
		}
	};
};

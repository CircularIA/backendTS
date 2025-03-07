import { Request, Response, NextFunction } from "express";

export enum USER_ROLES {
	ADMIN = "admin", //Admin has full access to the company
	SUPER_ADMIN = "super_admin", //Just for the circularia team, not for the users
	USER = "user", //User has restringed access to the system
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req.user && req.user.role === USER_ROLES.ADMIN) {
		return next();
	} else {
		return res.status(403).json({ message: "Unauthorized access" });
	}
};

export const isSuperAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user && req.user.role === USER_ROLES.SUPER_ADMIN) {
		return next();
	} else {
		return res.status(403).json({ message: "Unauthorized access" });
	}
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
	if (req.user && req.user.role === USER_ROLES.USER) {
		return next();
	} else {
		return res.status(403).json({ message: "Unauthorized access" });
	}
};

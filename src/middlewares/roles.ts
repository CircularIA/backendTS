import { Request, Response, NextFunction } from "express";

export enum USER_ROLES {
	ADMIN = "ADMIN", //Admin has full access to the company
	SUPER_ADMIN = "SUPER_ADMIN", //Just for the circularia team, not for the users
	USER = "USER", //User has restringed access to the system
	ECONOMIC_USER = "ECONOMIC_USER", //Economic user has access to the economic part of the system
	AMBIENTAL_USER = "AMBIENTAL_USER", //Ambiental user has access to the ambiental part of the system
	SOCIAL_USER = "SOCIAL_USER", //Social user has access to the social part of the
}

// Mapa jerárquico, del más poderoso al menos poderoso
const ROLE_HIERARCHY: USER_ROLES[] = [
	USER_ROLES.SUPER_ADMIN,
	USER_ROLES.ADMIN,
	USER_ROLES.ECONOMIC_USER,
	USER_ROLES.AMBIENTAL_USER,
	USER_ROLES.SOCIAL_USER,
	USER_ROLES.USER,
];

export const authorizeRoles = (...allowedRoles: USER_ROLES[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRole = req.user?.role as USER_ROLES;

		if (!userRole) {
			return res.status(401).json({ message: "No role found in user" });
		}

		// Encuentra el nivel jerárquico del rol del usuario
		const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);

		// Verifica si el usuario tiene al menos el nivel de alguno de los roles permitidos
		const isAuthorized = allowedRoles.some((role) => {
			const requiredRoleIndex = ROLE_HIERARCHY.indexOf(role);
			return userRoleIndex <= requiredRoleIndex; // menor índice = mayor privilegio
		});

		if (isAuthorized) {
			return next();
		} else {
			return res.status(403).json({ message: "Unauthorized access" });
		}
	};
};

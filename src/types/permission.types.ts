import { USER_ROLES } from "@src/middlewares/roles";

const Resources = {
	USER: "USER",
	ADMIN: "ADMIN",
	SUPER_ADMIN: "SUPER_ADMIN",
	INPUT_DATS: "INPUT_DATS",
	INDICATORS: "INDICATORS",
	ENTERPRISES: "ENTERPRISES",
	BRANCHES: "BRANCHES",
	ECONOMIC_INDICATORS: "ECONOMIC_INDICATORS",
	AMBIENTAL_INDICATORS: "AMBIENTAL_INDICATORS",
	SOCIAL_INDICATORS: "SOCIAL_INDICATORS",
};

const Actions = {
	CREATE: "CREATE",
	READ: "READ",
	UPDATE: "UPDATE",
	DELETE: "DELETE",
	MANAGE: "MANAGE", //Action that resumes all the actions above a resource
};

const Divider = ":";

export type IndicatorsType = "ECONOMIC" | "AMBIENTAL" | "SOCIAL";

// export type ResourceType = keyof typeof Resources;

// type ActionType = keyof typeof Actions;
export type RoleType = keyof typeof USER_ROLES;

const generatePermission = (): string[] => {
	const permissions: string[] = [];
	Object.keys(Resources).forEach((resource) => {
		Object.keys(Actions).forEach((action) => {
			if (action === Actions.MANAGE) return;
			permissions.push(`${resource}${Divider}${action}${Divider}`);
		});
	});
	return permissions;
};

const generateAdminPermission = (): string[] => {
	return [
		`${Resources.ENTERPRISES}${Divider}${Actions.READ}${Divider}`,
		`${Resources.ENTERPRISES}${Divider}${Actions.UPDATE}${Divider}`,
		`${Resources.BRANCHES}${Divider}${Actions.CREATE}${Divider}`,
		`${Resources.BRANCHES}${Divider}${Actions.READ}${Divider}`,
		`${Resources.BRANCHES}${Divider}${Actions.UPDATE}${Divider}`,
		`${Resources.USER}${Divider}${Actions.MANAGE}${Divider}`,
		`${Resources.INDICATORS}${Divider}${Actions.MANAGE}${Divider}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.MANAGE}${Divider}`,
		`${Resources.ECONOMIC_INDICATORS}${Divider}${Actions.MANAGE}${Divider}`,
		`${Resources.AMBIENTAL_INDICATORS}${Divider}${Actions.MANAGE}${Divider}`,
		`${Resources.SOCIAL_INDICATORS}${Divider}${Actions.MANAGE}${Divider}`,
	];
};

const generateUserPermission = (): string[] => {
	return [
		`${Resources.INDICATORS}${Divider}${Actions.READ}${Divider}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.READ}${Divider}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.CREATE}${Divider}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.UPDATE}${Divider}`,
	];
};

const generateUserPermissionByTheme = (theme: IndicatorsType): string[] => {
	return [
		`${Resources[`${theme}_INDICATORS`]}${Divider}${
			Actions.MANAGE
		}${Divider}`,
	];
};

//Admin can handle the actions above his enterprise
const RolePermissions = {
	SUPER_ADMIN: generatePermission(),
	ADMIN: generateAdminPermission(),
	USER: generateUserPermission(),
	ECONOMIC_USER: generateUserPermissionByTheme("ECONOMIC"),
	AMBIENTAL_USER: generateUserPermissionByTheme("AMBIENTAL"),
	SOCIAL_USER: generateUserPermissionByTheme("SOCIAL"),
};

export const generatePermissionByRole = (role: RoleType): string[] => {
	return RolePermissions[role];
};

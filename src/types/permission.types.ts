import { USER_ROLES } from "@src/middlewares/roles";

export const Resources = {
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

type ResourcesType = (typeof Resources)[keyof typeof Resources];

export const Actions = {
	CREATE: "CREATE",
	READ: "READ",
	UPDATE: "UPDATE",
	DELETE: "DELETE",
	MANAGE: "MANAGE", //Action that resumes all the actions above a resource
};

export type ActionsType = (typeof Actions)[keyof typeof Actions];

const Divider = ":";

export const createFormatPermission = (
	resource: ResourcesType,
	action: ActionsType
): string => {
	return `${resource}${Divider}${action}`;
};

export type IndicatorsType = "ECONOMIC" | "AMBIENTAL" | "SOCIAL";

// export type ResourceType = keyof typeof Resources;

// type ActionType = keyof typeof Actions;
export type RoleType = keyof typeof USER_ROLES;

const generatePermission = (): string[] => {
	const permissions: string[] = [];
	Object.keys(Resources).forEach((resource) => {
		Object.keys(Actions).forEach((action) => {
			if (action === Actions.MANAGE) return;
			permissions.push(`${resource}${Divider}${action}`);
		});
	});
	return permissions;
};

const generateAdminPermission = (): string[] => {
	return [
		`${Resources.ENTERPRISES}${Divider}${Actions.READ}`,
		`${Resources.ENTERPRISES}${Divider}${Actions.UPDATE}`,
		`${Resources.BRANCHES}${Divider}${Actions.CREATE}`,
		`${Resources.BRANCHES}${Divider}${Actions.READ}`,
		`${Resources.BRANCHES}${Divider}${Actions.UPDATE}`,
		`${Resources.USER}${Divider}${Actions.MANAGE}`,
		`${Resources.INDICATORS}${Divider}${Actions.MANAGE}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.MANAGE}`,
		`${Resources.ECONOMIC_INDICATORS}${Divider}${Actions.MANAGE}`,
		`${Resources.AMBIENTAL_INDICATORS}${Divider}${Actions.MANAGE}`,
		`${Resources.SOCIAL_INDICATORS}${Divider}${Actions.MANAGE}`,
	];
};

const generateUserPermission = (): string[] => {
	return [
		`${Resources.INDICATORS}${Divider}${Actions.READ}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.READ}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.CREATE}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.UPDATE}`,
	];
};

const generateUserPermissionByTheme = (theme: IndicatorsType): string[] => {
	return [
		`${Resources[`${theme}_INDICATORS`]}${Divider}${Actions.READ}`,
		`${Resources[`${theme}_INDICATORS`]}${Divider}${Actions.UPDATE}`,
		`${Resources[`${theme}_INDICATORS`]}${Divider}${Actions.CREATE}`,
		`${Resources[`${theme}_INDICATORS`]}${Divider}${Actions.DELETE}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.READ}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.CREATE}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.UPDATE}`,
		`${Resources.INPUT_DATS}${Divider}${Actions.DELETE}`,
		`${Resources.BRANCHES}${Divider}${Actions.READ}`,
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

export const getResourceByRole = (role: RoleType): ResourcesType | null => {
	switch (role) {
		case "AMBIENTAL_USER":
			return Resources.AMBIENTAL_INDICATORS;
		case "ECONOMIC_USER":
			return Resources.ECONOMIC_INDICATORS;
		case "SOCIAL_USER":
			return Resources.SOCIAL_INDICATORS;
		case "ADMIN":
		case "SUPER_ADMIN":
		case "USER":
			return Resources.INDICATORS;
		default:
			return null;
	}
};

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
};

const Divider = ":";

// type ResourceType = keyof typeof Resources;
// type ActionType = keyof typeof Actions;

const generatePermission = (): string[] => {
	const permissions: string[] = [];

	Object.values(Resources).forEach((resource) => {
		Object.values(Actions).forEach((action) => {
			permissions.push(`${resource}${Divider}${action}`);
		});
	});
	return permissions;
};

export const PERMISSION = generatePermission();

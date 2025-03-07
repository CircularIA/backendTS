import { USER_ROLES } from "@src/middlewares/roles";

export interface IRole extends Document {
	name: USER_ROLES;
	description: string;
	permissions: string[];
}

export interface RolesServices {
	getRoles(): Promise<USER_ROLES[]>;
	getRoleById(id: string): Promise<USER_ROLES | null>;
}

import { UserModel } from "@models/user.model";
import { StringValue } from "ms";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			MONGO_URI: string;
			SECRET_KEY: string;
			JWT_KEY: string;
			JWT_EXPIRES_IN: StringValue;
			RESET_PASSWORD_KEY: string;
			RESET_PASSWORD_EXPIRES_IN: StringValue;
			CPANEL_APP_EMAIL: string;
			CPANEL_APP_PASSWORD: string;
			CPANEL_APP_HOST: string;
			SECRET_KEY: string;
			SALT: number;
		}
	}
	namespace Express {
		interface Request {
			user?: UserModel | null;
		}
	}
}

export {};

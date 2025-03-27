import { Schema, model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { CONFIG } from "@src/config";
import { USER_ROLES } from "@src/middlewares/roles";

interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	resetPasswordToken: string;
	resetPasswordExpires: Date | null;
	company?: Types.ObjectId;
	role: USER_ROLES;
	permissions: string[];
	active: boolean;
	indicators: {
		_id: Schema.Types.ObjectId;
		sourceType: string[];
		active: boolean;
		activeRegisters: {
			date: Date;
			value: boolean;
			user: {
				name: string;
				email: string;
			};
		}[];
	}[];
	branches: Schema.Types.ObjectId[];
	generateAuthToken: () => {
		token: string;
		userId: string;
		userRole: string;
	};
	refreshToken: () => { token: string; userId: string; userRole: string };
	generatePasswordReset: () => string;
}

const userSchema = new Schema<IUser>({
	_id: Schema.Types.ObjectId,
	username: {
		type: String,
		required: [true, "Full name is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	//Define forget password atribute
	resetPasswordToken: {
		type: String,
		default: "",
	},
	resetPasswordExpires: {
		type: Date,
		default: null,
	},
	//Company information
	company: {
		type: Schema.Types.ObjectId,
		ref: "Company",
	},
	role: {
		type: String,
		enum: Object.values(USER_ROLES),
		default: USER_ROLES.USER,
		required: [true, "User type is required"],
	},
	permissions: [
		{
			type: String,
			required: [true, "Permissions are required"],
		},
	],
	//Flag to know if the user is active or not
	active: {
		type: Boolean,
		default: true,
	},
	indicators: [
		{
			_id: { type: Schema.Types.ObjectId, ref: "Indicator" },
			sourceType: [{ type: String }],
			active: { type: Boolean, default: true },
			activeRegisters: [
				{
					date: { type: Date, default: new Date() }, //Fecha de activacion (año, mes, dia)
					value: { type: Boolean, default: true }, //Valor de activacion
					user: {
						//Usuario que brindo el acceso al usuario
						name: { type: String },
						email: { type: String },
					},
				},
			],
		},
	],
	branches: [
		{
			type: Schema.Types.ObjectId,
			ref: "Branch",
		},
	],
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, role: this.role }, CONFIG.JWT_KEY, {
		expiresIn: CONFIG.JWT_EXPIRES_IN,
	});
	return { token, userId: this._id, userRole: this.role };
};

userSchema.methods.refreshToken = function () {
	const token = jwt.sign(
		{ _id: this._id, role: this.role },
		process.env.JWT_KEY,
		{ expiresIn: process.env.JWT_EXPIRES_IN }
	);
	return { token, userId: this._id, userRole: this.role };
};

userSchema.methods.generatePasswordReset = function () {
	const token = jwt.sign({ _id: this._id }, process.env.RESET_PASSWORD_KEY, {
		expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN,
	});
	return token;
};

const UserModel = model("User", userSchema);

export default UserModel;

import bcrypt from "bcrypt";

export const createSalt = () => {
	return bcrypt.genSaltSync();
};

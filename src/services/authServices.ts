import UserModel from "@src/models/Users";
import bcrypt from "bcrypt";

export const loginUser = async (email: string, password: string) => {
	try {
		const user = await UserModel.findOne({ email });
		console.log("User found:", user);
		if (!user) throw new Error("Invalid credentials");

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new Error("Invalid credentials");

		const token = user.generateAuthToken();
		return { user, token };
	} catch (error) {
		throw new Error("Error logging in user");
	}
};

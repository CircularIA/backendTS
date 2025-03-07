import { loginUser } from "@src/services/authService";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { email, password } = req.body;
		const { token, user } = await loginUser(email, password);
		return res.status(200).json({ token, user });
	} catch (error) {
		return res.status(401).json({ message: "Credenciais inválidas" });
	}
};

export const logout = (req: Request, res: Response) => {
	try {
		res.clearCookie("token"); // Limpa o cookie de autenticação
		return res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

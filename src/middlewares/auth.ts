import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CONFIG } from "@src/config";

export interface CustomRequest extends Request {
	token: string | jwt.JwtPayload;
	user?: any;
}

// Middleware para verificar el token JWT
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//Bearer Token
	const token = req.headers["authorization"]?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Acceso no autorizado" });
	}

	jwt.verify(token, CONFIG.JWT_KEY, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: "Token inválido" });
		}
		// Agrega el token decodificado al objeto de solicitud para su uso posterior
		(req as CustomRequest).token = decoded || token;
		(req as CustomRequest).user = decoded;
		console.log("Token decodificado:", decoded);
		next(); // Continúa con la siguiente función middleware o controlador
		return;
	});
	return;
};

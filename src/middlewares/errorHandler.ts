import { BaseError } from "@src/errors/BaseError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const status = err instanceof BaseError ? err.statusCode : 500;
	const message =
		err instanceof BaseError ? err.message : "Internal Server Error";

	res.status(status).json({ error: message });

	if (process.env.NODE_ENV === "development") {
		console.error("Error completo", err);
	}
};

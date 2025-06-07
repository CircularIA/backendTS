import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
	constructor(message = "Recurso no encontrado", cause?: unknown) {
		super(message, 404, cause);
	}
}

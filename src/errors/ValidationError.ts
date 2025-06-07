import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
	constructor(message = "Datos inválidos", cause?: unknown) {
		super(message, 400, cause);
	}
}

import { BaseError } from "./BaseError";

export class ServiceError extends BaseError {
	constructor(message = "Error en la lógica de negocio", cause?: unknown) {
		super(message, 500, cause);
	}
}

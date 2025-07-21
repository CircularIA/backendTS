import { BaseError } from "./BaseError";

const STATUS_CODE = 403;
const MESSAGE = "No tienes permisos para realizar esta acción";

export class PermissionError extends BaseError {
	constructor(message = MESSAGE, cause?: unknown) {
		super(message, STATUS_CODE, cause); // 403 Forbidden status code
	}
}

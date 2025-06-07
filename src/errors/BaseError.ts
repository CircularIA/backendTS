export class BaseError extends Error {
	constructor(
		public message: string,
		public statusCode: number = 500,
		public cause?: unknown
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

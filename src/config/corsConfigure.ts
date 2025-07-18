export const corsConfigure = {
	origin: process.env.CORS_ORIGIN,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
	credentials: true,
	allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
	exposedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
	maxAge: 86400,
};

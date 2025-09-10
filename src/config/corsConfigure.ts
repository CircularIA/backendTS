export const corsConfigure = {
	// origin: process.env.CORS_ORIGIN,
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
	credentials: false,
	allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
	exposedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
	maxAge: 86400,
};

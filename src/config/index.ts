const CONFIG = {
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.DB_URL || "mongodb://localhost:27017/circularia",
	JWT_KEY: process.env.JWT_KEY || "secret",
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
	NODE_ENV: process.env.NODE_ENV || "development",
	SECRET_KEY: process.env.SECRET_KEY || "secret",
	SALT: process.env.SALT || 2,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
};

export { CONFIG };

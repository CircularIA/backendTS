import { connect } from "mongoose";

export const connectDB = async (DBURL: string) => {
	try {
		await connect(DBURL || "");
		console.log("Connected to database.");
	} catch (error) {
		console.error("Error connecting to database:", error);
		process.exit(1);
	}
};

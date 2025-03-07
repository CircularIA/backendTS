import express from "express";
import cors from "cors";
import doteenv from "dotenv";
import { connectDB } from "./database";
import { corsConfigure } from "./config/corsConfigure";

//Configuración de dotenv
doteenv.config();
const app = express();
const DB = process.env.MONGO_URI || "";

//Middleware
app.use(express.json()); //Para que el servidor entienda JSON
app.use(cors(corsConfigure)); //Para que el servidor entienda CORS

//Routes

//Connect to MongoDB
connectDB(DB);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

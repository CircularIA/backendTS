import doteenv from "dotenv";
//Configuración de dotenv
doteenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./database";
import { corsConfigure } from "./config/corsConfigure";
import router from "./routes/routes";

const app = express();
const DB = process.env.MONGO_URI || "";

//Middleware
app.use(express.json()); //Para que el servidor entienda JSON
app.use(cors(corsConfigure)); //Para que el servidor entienda CORS

//Routes
app.use("/api/v1", router);

//Connect to MongoDB
connectDB(DB);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

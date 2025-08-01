import express from "express";
const router = express.Router();

import {
	saveSelections,
    getSelections,
    hasSelections,
} from "../controllers/userSelections";
import { verifyToken } from "../middlewares/auth";

// Route to save user selections
router.post("/:userId", verifyToken, saveSelections);
// Route to get user selections
router.get("/:userId", verifyToken, getSelections);
// Route to get bool, if user has selections
router.get("/hasSelections/:userId", verifyToken, hasSelections);

export default router;

import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { askSynapse } from "../controllers/synapseController.js";

const router = express.Router();

router.use(auth);
router.post("/ask", askSynapse);

export default router;

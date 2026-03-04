import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getAllDoubts,
  getDoubtsByStudent,
  createDoubt,
  respondToDoubt,
  deleteDoubt,
} from "../controllers/doubtController.js";

const router = express.Router();

// Protected routes
router.get("/", auth, getAllDoubts);
router.get("/my-doubts", auth, getDoubtsByStudent);
router.post("/", auth, createDoubt);
router.put("/:id/respond", auth, respondToDoubt);
router.delete("/:id", auth, deleteDoubt);

export default router;

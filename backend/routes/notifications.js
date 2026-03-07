import express from "express";
import auth from "../middlewares/auth.middleware.js"; // ✅ Updated import
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(auth); // ✅ Using your existing auth middleware

// Get all notifications for logged-in faculty
router.get("/", getNotifications);

// Mark a single notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;

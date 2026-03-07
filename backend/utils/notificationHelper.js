import Notification from "../models/Notification.js";

/**
 * Create a notification
 * @param {Object} data - Notification data
 * @param {String} data.facultyId - Faculty user ID
 * @param {String} data.userId - Student user ID
 * @param {String} data.type - Notification type
 * @param {String} data.message - Notification message
 * @param {Object} data.metadata - Additional metadata
 */
export const createNotification = async (data) => {
  try {
    const notification = new Notification({
      facultyId: data.facultyId,
      userId: data.userId,
      type: data.type,
      message: data.message,
      metadata: data.metadata || {},
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Create multiple notifications (bulk)
 */
export const createBulkNotifications = async (notificationsArray) => {
  try {
    return await Notification.insertMany(notificationsArray);
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
};

/**
 * Delete old notifications (cleanup)
 * @param {Number} daysOld - Delete notifications older than this many days
 */
export const deleteOldNotifications = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    return result;
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    throw error;
  }
};

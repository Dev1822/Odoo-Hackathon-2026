const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const notificationController = require('../../controllers/gamification/notification.controller');

router.get('/notifications', authenticate, notificationController.getNotifications);
router.patch('/notifications/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;

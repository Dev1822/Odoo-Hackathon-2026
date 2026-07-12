const asyncHandler = require('../../utils/asyncHandler');
const apiResponse = require('../../utils/apiResponse');
const notificationService = require('../../services/notification.service');

const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await notificationService.getNotifications(req.user.id, {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10
  });
  apiResponse(res, 200, true, 'Notifications retrieved successfully', result.data, result.meta);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(parseInt(req.params.id), req.user.id);
  apiResponse(res, 200, true, 'Notification marked as read', notification);
});

module.exports = {
  getNotifications,
  markAsRead
};

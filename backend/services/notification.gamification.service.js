// Replace with shared NotificationService once integrated with team backend
// Keep the notify(employeeId, type, payload) signature stable so calling code
// elsewhere doesn't need to change.

const prisma = require('../config/db');

const notify = async (employeeId, type, payload) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        employeeId,
        type,
        payload
      }
    });

    // Placeholder for real email/push notification
    console.log(`[NOTIFICATION] Employee ${employeeId}: ${type}`, {
      notificationId: notification.id,
      ...payload
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications shouldn't break the main flow
  }
};

const getNotifications = async (employeeId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { employeeId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where: { employeeId } })
  ]);

  return {
    data: notifications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const markAsRead = async (notificationId, employeeId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.employeeId !== employeeId) {
    throw new Error('Not authorized to mark this notification');
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  });

  return updated;
};

module.exports = {
  notify,
  getNotifications,
  markAsRead
};

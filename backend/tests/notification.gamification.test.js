const prisma = require('../config/db');
const notificationService = require('../services/notification.gamification.service');

describe('Notification Service', () => {
  let testEmployee;
  let testNotification;

  beforeAll(async () => {
    // Setup test employee
    testEmployee = await prisma.employee.create({
      data: {
        name: 'Notification Tester',
        email: `notif-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        role: 'EMPLOYEE',
        totalXp: 0
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.notification.deleteMany({
      where: { employeeId: testEmployee.id }
    });

    await prisma.employee.delete({
      where: { id: testEmployee.id }
    });

    await prisma.$disconnect();
  });

  describe('notify', () => {
    it('should successfully create a notification and log it', async () => {
      testNotification = await notificationService.notify(
        testEmployee.id,
        'TEST_NOTIF',
        { message: 'Hello World' }
      );

      expect(testNotification).toBeDefined();
      expect(testNotification.employeeId).toBe(testEmployee.id);
      expect(testNotification.type).toBe('TEST_NOTIF');
      expect(testNotification.payload).toEqual({ message: 'Hello World' });
      expect(testNotification.read).toBe(false);
    });

    it('should catch errors silently if creation fails', async () => {
      // Pass an invalid employeeId to trigger db constraint failure
      const result = await notificationService.notify(99999, 'FAIL_NOTIF', {});
      expect(result).toBeUndefined();
    });
  });

  describe('getNotifications', () => {
    it('should retrieve paginated list of notifications for employee', async () => {
      const result = await notificationService.getNotifications(testEmployee.id, { page: 1, limit: 10 });
      
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta).toBeDefined();
      expect(result.meta.total).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('should successfully mark notification as read', async () => {
      const updated = await notificationService.markAsRead(testNotification.id, testEmployee.id);
      expect(updated.read).toBe(true);
    });

    it('should throw an error if notification does not exist', async () => {
      await expect(
        notificationService.markAsRead(99999, testEmployee.id)
      ).rejects.toThrow('Notification not found');
    });

    it('should throw an error if employee does not own the notification', async () => {
      // Create a notification for a different employee or use a fake employeeId
      await expect(
        notificationService.markAsRead(testNotification.id, 99999)
      ).rejects.toThrow('Not authorized to mark this notification');
    });
  });
});

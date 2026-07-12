const prisma = require('../config/db');
const badgeService = require('../services/gamification/badge.service');

describe('Badge Service', () => {
  let testEmployee;
  let testBadge;

  beforeAll(async () => {
    // Create test employee
    testEmployee = await prisma.employee.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'EMPLOYEE',
        totalXp: 0
      }
    });

    // Create test badge
    testBadge = await prisma.badge.create({
      data: {
        name: 'Test Badge',
        description: 'Test badge for concurrency',
        icon: '🧪',
        unlockRule: { metric: 'totalXp', operator: '>=', value: 100 }
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.employeeBadge.deleteMany({
      where: { employeeId: testEmployee.id }
    });
    await prisma.badge.delete({
      where: { id: testBadge.id }
    });
    await prisma.employee.delete({
      where: { id: testEmployee.id }
    });
    await prisma.$disconnect();
  });

  describe('Concurrent Badge Awarding', () => {
    test('should award badge exactly once on concurrent calls', async () => {
      // Give employee enough XP to qualify for badge
      await prisma.employee.update({
        where: { id: testEmployee.id },
        data: { totalXp: 100 }
      });

      // Call checkAndAwardBadges concurrently
      const results = await Promise.allSettled([
        badgeService.checkAndAwardBadges(testEmployee.id),
        badgeService.checkAndAwardBadges(testEmployee.id),
        badgeService.checkAndAwardBadges(testEmployee.id),
        badgeService.checkAndAwardBadges(testEmployee.id),
        badgeService.checkAndAwardBadges(testEmployee.id)
      ]);

      // All should succeed
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });

      // Check that badge was awarded exactly once
      const employeeBadges = await prisma.employeeBadge.findMany({
        where: {
          employeeId: testEmployee.id,
          badgeId: testBadge.id
        }
      });

      expect(employeeBadges).toHaveLength(1);
    });
  });

  describe('Badge Creation Validation', () => {
    test('should reject malformed unlockRule at creation', async () => {
      await expect(
        badgeService.createBadge({
          name: 'Invalid Badge',
          description: 'Test',
          unlockRule: { metric: 'invalidMetric', operator: '>=', value: 10 }
        })
      ).rejects.toThrow('Invalid metric');

      await expect(
        badgeService.createBadge({
          name: 'Invalid Badge 2',
          description: 'Test',
          unlockRule: { metric: 'totalXp', operator: 'invalidOp', value: 10 }
        })
      ).rejects.toThrow('Unsupported operator');
    });
  });
});

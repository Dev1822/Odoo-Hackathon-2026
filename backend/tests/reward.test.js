const prisma = require('../config/db');
const rewardService = require('../services/gamification/reward.service');

describe('Reward Service - Concurrency', () => {
  let testEmployees = [];
  let testReward;

  beforeAll(async () => {
    // Create 20 test employees with enough XP
    for (let i = 0; i < 20; i++) {
      const employee = await prisma.employee.create({
        data: {
          name: `Test User ${i}`,
          email: `testuser${i}@example.com`,
          role: 'EMPLOYEE',
          totalXp: 1000
        }
      });
      testEmployees.push(employee);

      // Give each employee XP ledger entry
      await prisma.xpLedgerEntry.create({
        data: {
          employeeId: employee.id,
          sourceType: 'ADJUSTMENT',
          points: 1000
        }
      });
    }

    // Create test reward with stock=1
    testReward = await prisma.reward.create({
      data: {
        name: 'Limited Reward',
        description: 'Test reward for concurrency',
        pointsRequired: 500,
        stock: 1,
        status: 'ACTIVE'
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.rewardRedemption.deleteMany({
      where: { rewardId: testReward.id }
    });
    await prisma.reward.delete({
      where: { id: testReward.id }
    });
    
    for (const employee of testEmployees) {
      await prisma.xpLedgerEntry.deleteMany({
        where: { employeeId: employee.id }
      });
      await prisma.employee.delete({
        where: { id: employee.id }
      });
    }
    
    await prisma.$disconnect();
  });

  test('should handle 20 concurrent redemption requests against stock=1', async () => {
    // Create 20 concurrent redemption requests
    const promises = testEmployees.map(employee =>
      rewardService.redeem(employee.id, testReward.id)
    );

    const results = await Promise.allSettled(promises);

    // Count successes and failures
    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected');

    // Exactly 1 should succeed, 19 should fail with 409
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(19);

    // All failures should be due to stock issues
    failures.forEach(result => {
      expect(result.reason.message).toMatch(/stock/i);
    });

    // Verify final stock is 0
    const finalReward = await prisma.reward.findUnique({
      where: { id: testReward.id }
    });
    expect(finalReward.stock).toBe(0);

    // Verify exactly 1 redemption record exists
    const redemptions = await prisma.rewardRedemption.findMany({
      where: { rewardId: testReward.id }
    });
    expect(redemptions).toHaveLength(1);
  });
});

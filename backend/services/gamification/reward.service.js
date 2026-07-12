const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');
const { Prisma } = require('@prisma/client');
const leaderboardService = require('./leaderboard.service');

const notificationService = {
  notify: async (employeeId, type, payload) => {
    // Placeholder - implemented in commit 9
    console.log(`Notification sent to employee ${employeeId}: ${type}`, payload);
  }
};

const listRewards = async () => {
  const rewards = await prisma.reward.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { pointsRequired: 'asc' }
  });
  return rewards;
};

const createReward = async (data) => {
  const reward = await prisma.reward.create({
    data
  });
  return reward;
};

const updateReward = async (id, data) => {
  const reward = await prisma.reward.update({
    where: { id },
    data
  });
  return reward;
};

const redeem = async (employeeId, rewardId) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch reward and verify status & stock
    const reward = await tx.reward.findUnique({
      where: { id: rewardId }
    });

    if (!reward) {
      throw new ApiError(404, 'Reward not found');
    }

    if (reward.status !== 'ACTIVE') {
      throw new ApiError(409, 'Reward is not available');
    }

    if (reward.stock <= 0) {
      throw new ApiError(409, 'Reward is out of stock');
    }

    // 2. Check employee's XP balance
    const balance = await tx.xpLedgerEntry.aggregate({
      where: { employeeId },
      _sum: { points: true }
    });

    const totalPoints = balance._sum.points || 0;

    if (totalPoints < reward.pointsRequired) {
      throw new ApiError(400, 'Insufficient points');
    }

    // 3. Atomic stock decrement using raw SQL
    const affectedRows = await tx.$executeRaw`
      UPDATE rewards 
      SET stock = stock - 1 
      WHERE id = ${rewardId} AND stock > 0
    `;

    if (affectedRows === 0) {
      throw new ApiError(409, 'Out of stock (race condition)');
    }

    // 4. Create XP ledger entry (negative points)
    await tx.xpLedgerEntry.create({
      data: {
        employeeId,
        sourceType: 'REDEMPTION',
        sourceId: rewardId,
        points: -reward.pointsRequired
      }
    });

    // 5. Decrement employee total XP
    await tx.employee.update({
      where: { id: employeeId },
      data: {
        totalXp: {
          decrement: reward.pointsRequired
        }
      }
    });

    // 6. Create redemption record
    const redemption = await tx.rewardRedemption.create({
      data: {
        employeeId,
        rewardId,
        pointsDeducted: reward.pointsRequired
      },
      include: {
        reward: true,
        employee: true
      }
    });

    return redemption;
  });

  // After transaction, send notification
  await notificationService.notify(employeeId, 'REWARD_REDEEMED', {
    rewardId: result.rewardId,
    rewardName: result.reward.name,
    pointsDeducted: result.pointsDeducted
  });

  // Invalidate leaderboard cache
  leaderboardService.invalidateLeaderboardCache();

  return result;
};

module.exports = {
  listRewards,
  createReward,
  updateReward,
  redeem
};

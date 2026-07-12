const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');
const notificationService = require('../notification.service');

const checkAndAwardBadges = async (employeeId) => {
  // Fetch employee stats
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      totalXp: true,
      _count: {
        select: {
          challengeParticipations: {
            where: {
              approvalStatus: 'APPROVED'
            }
          }
        }
      }
    }
  });

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const stats = {
    totalXp: employee.totalXp,
    completedChallenges: employee._count.challengeParticipations
  };

  // Fetch badges not already awarded to this employee
  const awardedBadgeIds = await prisma.employeeBadge
    .findMany({
      where: { employeeId },
      select: { badgeId: true }
    })
    .then(badges => badges.map(b => b.badgeId));

  const availableBadges = await prisma.badge.findMany({
    where: {
      id: { notIn: awardedBadgeIds }
    }
  });

  // Evaluate each badge
  for (const badge of availableBadges) {
    const { metric, operator, value } = badge.unlockRule;
    const statValue = stats[metric];

    if (statValue === undefined) {
      console.error(`Invalid metric in unlockRule: ${metric}`);
      continue;
    }

    let satisfied = false;
    switch (operator) {
      case '>=':
        satisfied = statValue >= value;
        break;
      case '>':
        satisfied = statValue > value;
        break;
      case '==':
        satisfied = statValue === value;
        break;
      case '<=':
        satisfied = statValue <= value;
        break;
      case '<':
        satisfied = statValue < value;
        break;
      default:
        console.error(`Unsupported operator: ${operator}`);
        continue;
    }

    if (satisfied) {
      try {
        await prisma.employeeBadge.create({
          data: {
            employeeId,
            badgeId: badge.id
          }
        });

        await notificationService.notify(employeeId, 'BADGE_UNLOCKED', {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeIcon: badge.icon
        });
      } catch (error) {
        if (error.code === 'P2002') {
          // Concurrency-safe: badge already awarded by another request
          console.log(`Badge ${badge.id} already awarded to employee ${employeeId}`);
        } else {
          console.error('Error awarding badge:', error);
        }
      }
    }
  }
};

const createBadge = async (data) => {
  // Validate unlockRule at creation
  const { metric, operator, value } = data.unlockRule;
  const allowedMetrics = ['totalXp', 'completedChallenges'];
  const supportedOperators = ['>=', '>', '==', '<=', '<'];

  if (!allowedMetrics.includes(metric)) {
    throw new ApiError(400, `Invalid metric. Must be one of: ${allowedMetrics.join(', ')}`);
  }

  if (!supportedOperators.includes(operator)) {
    throw new ApiError(400, `Unsupported operator. Must be one of: ${supportedOperators.join(', ')}`);
  }

  if (typeof value !== 'number' || value < 0) {
    throw new ApiError(400, 'Value must be a non-negative number');
  }

  const badge = await prisma.badge.create({
    data
  });

  return badge;
};

const listBadges = async () => {
  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return badges;
};

const getEmployeeBadges = async (employeeId) => {
  const employeeBadges = await prisma.employeeBadge.findMany({
    where: { employeeId },
    include: {
      badge: true
    },
    orderBy: { awardedAt: 'desc' }
  });

  return employeeBadges.map(eb => ({
    ...eb.badge,
    awardedAt: eb.awardedAt
  }));
};

module.exports = {
  checkAndAwardBadges,
  createBadge,
  listBadges,
  getEmployeeBadges
};

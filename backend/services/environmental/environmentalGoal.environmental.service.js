const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');

const createGoal = async (data) => {
  const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
  if (!department) throw new ApiError(404, 'Department not found');

  return prisma.environmentalGoal.create({
    data: {
      name: data.name,
      departmentId: data.departmentId,
      targetCo2e: data.targetCo2e,
      currentCo2e: 0,
      deadline: new Date(data.deadline),
      status: 'ACTIVE'
    },
    include: { department: true }
  });
};

const listGoals = async ({ departmentId, status, search, page = 1, limit = 10 }) => {
  const where = {};
  if (departmentId) where.departmentId = departmentId;
  if (status) where.status = status;
  if (search) {
    where.name = { contains: search };
  }

  const [data, total] = await Promise.all([
    prisma.environmentalGoal.findMany({
      where,
      include: { department: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.environmentalGoal.count({ where })
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

const updateGoal = async (id, data) => {
  const existing = await prisma.environmentalGoal.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Goal not found');

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.targetCo2e !== undefined) updateData.targetCo2e = data.targetCo2e;
  if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);
  if (data.status !== undefined) updateData.status = data.status;

  // currentCo2e is NEVER directly editable via this endpoint

  return prisma.environmentalGoal.update({
    where: { id },
    data: updateData,
    include: { department: true }
  });
};

const deleteGoal = async (id) => {
  const existing = await prisma.environmentalGoal.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, 'Goal not found');

  await prisma.environmentalGoal.delete({ where: { id } });
  return { success: true, message: 'Goal deleted successfully' };
};

const recalculateProgress = async (departmentId) => {
  // Find all ACTIVE, ON_TRACK, AT_RISK goals for this department
  const goals = await prisma.environmentalGoal.findMany({
    where: {
      departmentId,
      status: { in: ['ACTIVE', 'ON_TRACK', 'AT_RISK'] }
    }
  });

  for (const goal of goals) {
    // SUM of CarbonTransaction.calculatedCo2e in tracking window (goal.createdAt to now)
    const aggregate = await prisma.carbonTransaction.aggregate({
      where: {
        departmentId,
        transactionDate: {
          gte: goal.createdAt
        }
      },
      _sum: {
        calculatedCo2e: true
      }
    });

    const sumVal = aggregate._sum.calculatedCo2e || 0;
    const currentCo2e = parseFloat(sumVal);
    const targetCo2e = parseFloat(goal.targetCo2e);

    // Progress % calculation
    // Assume progress % = (currentCo2e / targetCo2e) * 100
    const progressPercent = targetCo2e > 0 ? (currentCo2e / targetCo2e) * 100 : 0;

    let newStatus = goal.status;
    
    // Auto-transition logic:
    // if progress >= 100 -> COMPLETED
    // if deadline is within 30 days and progress < 80% -> AT_RISK
    // else ON_TRACK
    const now = new Date();
    const deadlineDate = new Date(goal.deadline);
    const msDiff = deadlineDate - now;
    const daysDiff = msDiff / (1000 * 60 * 60 * 24);

    if (currentCo2e >= targetCo2e) { // Or progressPercent >= 100
      newStatus = 'COMPLETED';
    } else if (daysDiff <= 30 && progressPercent < 80) {
      newStatus = 'AT_RISK';
    } else {
      newStatus = 'ON_TRACK';
    }

    const updatedGoal = await prisma.environmentalGoal.update({
      where: { id: goal.id },
      data: {
        currentCo2e,
        status: newStatus
      }
    });

    // If transitioned to COMPLETED, log to ActivityLog
    if (newStatus === 'COMPLETED' && goal.status !== 'COMPLETED') {
      try {
        const activityLogService = require('../activityLog.service');
        await activityLogService.log({
          module: 'ENVIRONMENTAL',
          eventType: 'GOAL_COMPLETED',
          departmentId,
          description: `${goal.name} goal completed`
        });
      } catch (err) { /* activityLog might not be fully wired/mocked yet */ }

      // Also trigger department score recalculation
      try {
        const departmentScoreService = require('../departmentScore.service');
        await departmentScoreService.recalculateEnvironmentalScore(departmentId);
      } catch (err) { /* departmentScore might not be fully wired/mocked yet */ }
    }
  }
};

module.exports = {
  createGoal,
  listGoals,
  updateGoal,
  deleteGoal,
  recalculateProgress
};

/**
 * Department Score Recalculation Service — Shared
 *
 * Teammates implementing Social or Governance modules will extend this file
 * with their respective score calculation methods.
 */

const prisma = require('../config/db');

// Configurable scoring weights for calculating environmentalScore
const SCORING_WEIGHTS = {
  GOAL_COMPLETION: 0.60, // 60% weight
  EMISSION_TREND: 0.40   // 40% weight
};

// Configurable organization-wide weights for total ESG Score (Section 5)
const ESG_WEIGHTS = {
  ENVIRONMENTAL: 0.40,  // 40% weight
  SOCIAL: 0.30,         // 30% weight
  GOVERNANCE: 0.30      // 30% weight
};

const recalculateEnvironmentalScore = async (departmentId) => {
  // 1. Calculate Goal Completion Rate
  const totalGoals = await prisma.environmentalGoal.count({
    where: { departmentId }
  });

  const completedGoals = await prisma.environmentalGoal.count({
    where: {
      departmentId,
      status: 'COMPLETED'
    }
  });

  const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 100; // default to 100 if no goals

  // 2. Calculate Emission Trend Score (compare last 3 months avg CO2e vs prior 3 months avg)
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const [currentPeriodTx, priorPeriodTx] = await Promise.all([
    prisma.carbonTransaction.aggregate({
      where: {
        departmentId,
        transactionDate: { gte: threeMonthsAgo }
      },
      _sum: { calculatedCo2e: true }
    }),
    prisma.carbonTransaction.aggregate({
      where: {
        departmentId,
        transactionDate: { gte: sixMonthsAgo, lt: threeMonthsAgo }
      },
      _sum: { calculatedCo2e: true }
    })
  ]);

  const currentAvg = (currentPeriodTx._sum.calculatedCo2e || 0) / 3;
  const priorAvg = (priorPeriodTx._sum.calculatedCo2e || 0) / 3;

  let emissionTrendScore = 100; // Default to perfect score if no prior emissions
  if (priorAvg > 0) {
    // If we reduced average emissions, score goes up. If emissions increased, score goes down.
    const changePct = ((priorAvg - currentAvg) / priorAvg) * 100;
    // Improvement of 20% or more yields a score of 100.
    // Scale score between 0 and 100 based on improvement/degradation.
    emissionTrendScore = Math.max(0, Math.min(100, 50 + (changePct * 2.5)));
  }

  // 3. Compute weighted Environmental Score
  const environmentalScore = (goalCompletionRate * SCORING_WEIGHTS.GOAL_COMPLETION) +
                             (emissionTrendScore * SCORING_WEIGHTS.EMISSION_TREND);

  // 4. Fetch existing scores to preserve socialScore & governanceScore
  let currentScoreRow = await prisma.departmentScore.findUnique({
    where: { departmentId }
  });

  const socialScore = currentScoreRow ? parseFloat(currentScoreRow.socialScore) : 0;
  const governanceScore = currentScoreRow ? parseFloat(currentScoreRow.governanceScore) : 0;

  // 5. Calculate weighted Total ESG Score
  const totalScore = (environmentalScore * ESG_WEIGHTS.ENVIRONMENTAL) +
                     (socialScore * ESG_WEIGHTS.SOCIAL) +
                     (governanceScore * ESG_WEIGHTS.GOVERNANCE);

  // 6. Upsert the DepartmentScore record
  return prisma.departmentScore.upsert({
    where: { departmentId },
    update: {
      environmentalScore,
      totalScore
    },
    create: {
      departmentId,
      environmentalScore,
      socialScore: 0,
      governanceScore: 0,
      totalScore
    }
  });
};

const getDepartmentScore = async (departmentId) => {
  return prisma.departmentScore.findUnique({
    where: { departmentId },
    include: { department: true }
  });
};

const getAllDepartmentScores = async () => {
  return prisma.departmentScore.findMany({
    orderBy: { totalScore: 'desc' },
    include: { department: true }
  });
};

/**
 * Get Overall organization-wide ESG Score.
 * Computes an employee-count-weighted average across all departments.
 *
 * NOTE: Larger departments count more because their overall footprint, operations,
 * and personnel representation has a proportionally higher impact on organization ESG standing.
 * Teammates/Administrators can revisit this logic if organization policies require flat averages.
 */
const getOverallEsgScore = async () => {
  const [scores, departments] = await Promise.all([
    prisma.departmentScore.findMany(),
    prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      }
    })
  ]);

  if (scores.length === 0) {
    return {
      overall: 0,
      environmental: 0,
      social: 0,
      governance: 0
    };
  }

  let totalEmployees = 0;
  let weightedOverall = 0;
  let weightedEnv = 0;
  let weightedSoc = 0;
  let weightedGov = 0;

  const deptEmployeeMap = {};
  departments.forEach(d => {
    deptEmployeeMap[d.id] = d._count.employees || 0;
  });

  scores.forEach(s => {
    const empCount = deptEmployeeMap[s.departmentId] || 0;
    totalEmployees += empCount;
    weightedOverall += parseFloat(s.totalScore) * empCount;
    weightedEnv += parseFloat(s.environmentalScore) * empCount;
    weightedSoc += parseFloat(s.socialScore) * empCount;
    weightedGov += parseFloat(s.governanceScore) * empCount;
  });

  if (totalEmployees === 0) {
    // If no employees are registered, return standard averages
    const count = scores.length;
    const sumVal = scores.reduce((acc, curr) => acc + parseFloat(curr.totalScore), 0);
    const envVal = scores.reduce((acc, curr) => acc + parseFloat(curr.environmentalScore), 0);
    const socVal = scores.reduce((acc, curr) => acc + parseFloat(curr.socialScore), 0);
    const govVal = scores.reduce((acc, curr) => acc + parseFloat(curr.governanceScore), 0);

    return {
      overall: parseFloat((sumVal / count).toFixed(2)),
      environmental: parseFloat((envVal / count).toFixed(2)),
      social: parseFloat((socVal / count).toFixed(2)),
      governance: parseFloat((govVal / count).toFixed(2))
    };
  }

  return {
    overall: parseFloat((weightedOverall / totalEmployees).toFixed(2)),
    environmental: parseFloat((weightedEnv / totalEmployees).toFixed(2)),
    social: parseFloat((weightedSoc / totalEmployees).toFixed(2)),
    governance: parseFloat((weightedGov / totalEmployees).toFixed(2))
  };
};

module.exports = {
  recalculateEnvironmentalScore,
  getDepartmentScore,
  getAllDepartmentScores,
  getOverallEsgScore
};

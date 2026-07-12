const departmentScoreService = require('./departmentScore.service');
const carbonTransactionService = require('./environmental/carbonTransaction.environmental.service');
const activityLogService = require('./activityLog.service');

const getExecutiveOverview = async () => {
  // Execute sub-queries in parallel via Promise.all
  const [overallEsgScore, emissionsTrend, departmentScores, recentActivity] = await Promise.all([
    departmentScoreService.getOverallEsgScore(),
    carbonTransactionService.getEmissionsTrend({ months: 12 }),
    departmentScoreService.getAllDepartmentScores(),
    activityLogService.getRecentActivity({ limit: 5 })
  ]);

  return {
    kpis: overallEsgScore,
    emissionsTrend,
    departmentScores,
    recentActivity
  };
};

module.exports = {
  getExecutiveOverview
};

/**
 * Shared service — Social/Governance modules should import and call
 * activityLogService.log() with their own eventType strings rather than
 * writing their own logging table. Agree on eventType naming conventions
 * as a team.
 */

const prisma = require('../config/db');

const log = async ({ module, eventType, description, departmentId, employeeId, metadata }) => {
  return prisma.activityLog.create({
    data: {
      module,
      eventType,
      description,
      departmentId: departmentId || null,
      employeeId: employeeId || null,
      metadata: metadata || null
    }
  });
};

const getRecentActivity = async ({ limit = 10, departmentId, module } = {}) => {
  const where = {};
  if (departmentId) where.departmentId = departmentId;
  if (module) where.module = module;

  return prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      department: true,
      employee: true
    }
  });
};

module.exports = {
  log,
  getRecentActivity
};

const prisma = require('../../config/db');
const { Prisma } = require('@prisma/client');
const cache = require('../../utils/cache');

const getEmployeeLeaderboard = async ({ limit = 20, departmentId }) => {
  const cacheKey = `leaderboard:employee:${departmentId || 'all'}:${limit}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let query;
  let params = { limit };

  if (departmentId) {
    query = Prisma.sql`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.totalXp,
        d.name as departmentName,
        RANK() OVER (ORDER BY e.totalXp DESC) as rank
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      WHERE e.departmentId = ${departmentId}
      GROUP BY e.id
      ORDER BY e.totalXp DESC
      LIMIT ${limit}
    `;
  } else {
    query = Prisma.sql`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.totalXp,
        d.name as departmentName,
        RANK() OVER (ORDER BY e.totalXp DESC) as rank
      FROM employees e
      LEFT JOIN departments d ON e.departmentId = d.id
      GROUP BY e.id
      ORDER BY e.totalXp DESC
      LIMIT ${limit}
    `;
  }

  const leaderboard = await prisma.$queryRaw(query);

  // Cache the result
  cache.set(cacheKey, leaderboard);

  return leaderboard;
};

const getDepartmentLeaderboard = async ({ limit = 20 }) => {
  const cacheKey = `leaderboard:department:${limit}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const query = Prisma.sql`
    SELECT 
      d.id,
      d.name,
      d.code,
      SUM(e.totalXp) as totalXp,
      COUNT(e.id) as employeeCount,
      RANK() OVER (ORDER BY SUM(e.totalXp) DESC) as rank
    FROM departments d
    LEFT JOIN employees e ON e.departmentId = d.id
    GROUP BY d.id
    ORDER BY SUM(e.totalXp) DESC
    LIMIT ${limit}
  `;

  const leaderboard = await prisma.$queryRaw(query);

  // Cache the result
  cache.set(cacheKey, leaderboard);

  return leaderboard;
};

const invalidateLeaderboardCache = () => {
  cache.flushAll();
};

module.exports = {
  getEmployeeLeaderboard,
  getDepartmentLeaderboard,
  invalidateLeaderboardCache
};

const leaderboardService = require('../services/gamification/leaderboard.service');
const cache = require('../utils/cache');

describe('Leaderboard Service - Caching', () => {
  beforeEach(() => {
    // Clear cache before each test
    cache.flushAll();
  });

  afterAll(() => {
    cache.flushAll();
  });

  test('should cache leaderboard results', async () => {
    const params = { limit: 20 };
    
    // First call - should hit database
    const result1 = await leaderboardService.getEmployeeLeaderboard(params);
    expect(result1).toBeDefined();

    // Second call - should hit cache
    const result2 = await leaderboardService.getEmployeeLeaderboard(params);
    expect(result2).toBeDefined();

    // Results should be identical (from cache)
    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));

    // Check cache stats
    const stats = cache.getStats();
    expect(stats.hits).toBeGreaterThan(0);
  });

  test('should invalidate cache on flush', async () => {
    const params = { limit: 20 };
    
    // First call
    await leaderboardService.getEmployeeLeaderboard(params);
    
    // Invalidate cache
    leaderboardService.invalidateLeaderboardCache();
    
    // Check cache is empty
    const stats = cache.getStats();
    expect(stats.keys).toBe(0);
  });
});

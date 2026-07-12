const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Challenge State Machine', () => {
  let authToken;
  let adminUser;
  let testChallenge;

  beforeAll(async () => {
    // Get admin user from seed
    adminUser = await prisma.employee.findFirst({
      where: { role: 'ADMIN' }
    });

    // Generate JWT token
    authToken = jwt.sign(
      { employeeId: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Status Transitions', () => {
    test('should allow DRAFT to ACTIVE transition', async () => {
      // Create a DRAFT challenge
      testChallenge = await prisma.challenge.create({
        data: {
          title: 'Test Challenge',
          categoryId: 1,
          description: 'Test description',
          xp: 100,
          difficulty: 'EASY',
          status: 'DRAFT',
          createdById: adminUser.id
        }
      });

      const response = await request(app)
        .patch(`/api/gamification/challenges/${testChallenge.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'ACTIVE' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('ACTIVE');
    });

    test('should reject illegal status transition', async () => {
      const response = await request(app)
        .patch(`/api/gamification/challenges/${testChallenge.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'DRAFT' }); // ACTIVE to DRAFT is illegal

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot transition');
    });

    test('should reject update once status is not DRAFT', async () => {
      const response = await request(app)
        .put(`/api/gamification/challenges/${testChallenge.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('DRAFT status');
    });
  });

  describe('Pagination', () => {
    test('should return correct pagination meta', async () => {
      const response = await request(app)
        .get('/api/gamification/challenges?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('limit');
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('totalPages');
    });
  });

  afterAll(async () => {
    // Cleanup test challenge
    if (testChallenge) {
      await prisma.challenge.delete({
        where: { id: testChallenge.id }
      });
    }
  });
});

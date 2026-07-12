const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Environmental Module Tests', () => {
  let authToken;
  let adminUser;
  let testCategory;
  let testFactor;
  let testDept;

  beforeAll(async () => {
    // Retrieve seed records
    adminUser = await prisma.employee.findFirst({
      where: { role: 'ADMIN' }
    });

    testCategory = await prisma.category.findFirst({
      where: { type: 'EMISSION_FACTOR' }
    });

    testDept = await prisma.department.findFirst();

    authToken = jwt.sign(
      { employeeId: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Emission Factor CRUD', () => {
    test('create factor value validation & dates', async () => {
      const payload = {
        categoryId: testCategory.id,
        name: 'Wind energy',
        unit: 'kgCO2e/kWh',
        factorValue: 0.015,
        source: 'DEFRA 2026',
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 86400000).toISOString()
      };

      const res = await request(app)
        .post('/api/environmental/emission-factors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(parseFloat(res.body.data.factorValue)).toBe(0.015);
      testFactor = res.body.data;
    });

    test('update factor does not retroactively change computed co2e on past transactions', async () => {
      // Create a manual transaction using the test factor
      const txRes = await request(app)
        .post('/api/environmental/carbon-transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          departmentId: testDept.id,
          emissionFactorId: testFactor.id,
          quantity: 100,
          transactionDate: new Date().toISOString()
        });

      expect(txRes.status).toBe(201);
      const originalCo2e = parseFloat(txRes.body.data.calculatedCo2e);

      // Now update the factorValue
      const updateRes = await request(app)
        .put(`/api/environmental/emission-factors/${testFactor.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          factorValue: 5.5
        });

      expect(updateRes.status).toBe(200);

      // Fetch the transaction again and confirm it has NOT changed
      const fetchedTx = await prisma.carbonTransaction.findUnique({
        where: { id: txRes.body.data.id }
      });
      expect(parseFloat(fetchedTx.calculatedCo2e)).toBe(originalCo2e);

      // Clean up the created transaction
      await prisma.carbonTransaction.delete({
        where: { id: txRes.body.data.id }
      });
    });
  });

  describe('Carbon Transaction Validation', () => {
    test('should reject auto calculation when transactionDate falls outside validity window', async () => {
      const carbonTransactionService = require('../services/environmental/carbonTransaction.environmental.service');
      
      // Attempt to record transaction date outside the factor's validity (e.g. 5 days ago)
      const pastDate = new Date(Date.now() - 5 * 86400000);
      const futureDate = new Date(Date.now() + 5 * 86400000); // Beyond factor validTo if validTo is +1 day
      
      await expect(
        carbonTransactionService.createFromSourceRecord({
          departmentId: testDept.id,
          emissionFactorId: testFactor.id,
          sourceModule: 'FLEET',
          quantity: 50,
          transactionDate: futureDate.toISOString()
        })
      ).rejects.toThrow();
    });
  });

  describe('Environmental Goal status auto-transition', () => {
    test('ACTIVE flips to AT_RISK if deadline is near and progress is low', async () => {
      const environmentalGoalService = require('../services/environmental/environmentalGoal.environmental.service');

      // Create goal: target 1000 CO2e, deadline 5 days from now
      const goal = await prisma.environmentalGoal.create({
        data: {
          name: 'Test Goal Near Deadline',
          departmentId: testDept.id,
          targetCo2e: 1000.0,
          currentCo2e: 0,
          deadline: new Date(Date.now() + 5 * 86400000), // Within 30 days
          status: 'ACTIVE'
        }
      });

      // Recalculate progress (which will find current carbon transactions = 0, meaning progress = 0%)
      await environmentalGoalService.recalculateProgress(testDept.id);

      const updatedGoal = await prisma.environmentalGoal.findUnique({
        where: { id: goal.id }
      });

      // Deadline is close and progress (< 80%), status must be AT_RISK
      expect(updatedGoal.status).toBe('AT_RISK');

      // Cleanup
      await prisma.environmentalGoal.delete({
        where: { id: goal.id }
      });
    });
  });

  describe('Department Score Aggregation', () => {
    test('does not overwrite pre-existing social or governance scores', async () => {
      const departmentScoreService = require('../services/departmentScore.service');

      // Manually set some non-zero social and governance scores
      await prisma.departmentScore.upsert({
        where: { departmentId: testDept.id },
        update: {
          socialScore: 80.00,
          governanceScore: 90.00
        },
        create: {
          departmentId: testDept.id,
          socialScore: 80.00,
          governanceScore: 90.00,
          environmentalScore: 0.00,
          totalScore: 0.00
        }
      });

      // Recalculate environmental score
      await departmentScoreService.recalculateEnvironmentalScore(testDept.id);

      const finalScores = await prisma.departmentScore.findUnique({
        where: { departmentId: testDept.id }
      });

      // Verify social & governance fields are intact
      expect(parseFloat(finalScores.socialScore)).toBe(80.00);
      expect(parseFloat(finalScores.governanceScore)).toBe(90.00);
      expect(parseFloat(finalScores.environmentalScore)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Report Exports API', () => {
    test('returns correct headers for CSV export', async () => {
      const from = new Date(Date.now() - 86400000).toISOString();
      const to = new Date().toISOString();
      const res = await request(app)
        .get(`/api/reports/environmental?departmentId=${testDept.id}&dateFrom=${from}&dateTo=${to}&format=csv`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
    });

    test('returns correct headers for PDF export', async () => {
      const from = new Date(Date.now() - 86400000).toISOString();
      const to = new Date().toISOString();
      const res = await request(app)
        .get(`/api/reports/environmental?departmentId=${testDept.id}&dateFrom=${from}&dateTo=${to}&format=pdf`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
    });
  });

  // Cleanup newly created test factor at the end
  afterAll(async () => {
    if (testFactor) {
      await prisma.emissionFactor.delete({
        where: { id: testFactor.id }
      }).catch(() => {});
    }
  });
});

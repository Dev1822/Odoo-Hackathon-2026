const prisma = require('../config/db');
const participationService = require('../services/gamification/participation.gamification.service');

// Mock uploadToCloudinary to avoid network requests
jest.mock('../utils/uploadToCloudinary', () => {
  return jest.fn().mockResolvedValue('https://res.cloudinary.com/demo/image/upload/proof.jpg');
});

describe('Participation Service', () => {
  let testEmployee;
  let testCategory;
  let testChallenge;
  let testParticipation;

  beforeAll(async () => {
    // Setup test employee
    testEmployee = await prisma.employee.create({
      data: {
        name: 'Participation Tester',
        email: `part-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        role: 'EMPLOYEE',
        totalXp: 100
      }
    });

    // Create a category
    testCategory = await prisma.category.create({
      data: {
        name: `Test Cat ${Date.now()}`,
        type: 'CHALLENGE',
        status: 'ACTIVE'
      }
    });

    // Create an ACTIVE challenge
    testChallenge = await prisma.challenge.create({
      data: {
        title: 'Active Challenge',
        categoryId: testCategory.id,
        description: 'Testing participation service',
        xp: 250,
        difficulty: 'MEDIUM',
        status: 'ACTIVE',
        createdById: testEmployee.id
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testParticipation) {
      await prisma.challengeParticipation.deleteMany({
        where: { challengeId: testChallenge.id }
      }).catch(() => {});
    }
    
    await prisma.challenge.deleteMany({
      where: { categoryId: testCategory.id }
    }).catch(() => {});

    await prisma.category.delete({
      where: { id: testCategory.id }
    }).catch(() => {});

    await prisma.xpLedgerEntry.deleteMany({
      where: { employeeId: testEmployee.id }
    }).catch(() => {});

    await prisma.notification.deleteMany({
      where: { employeeId: testEmployee.id }
    }).catch(() => {});

    await prisma.employee.delete({
      where: { id: testEmployee.id }
    }).catch(() => {});

    await prisma.$disconnect();
  });

  describe('joinChallenge', () => {
    it('should successfully join an ACTIVE challenge', async () => {
      testParticipation = await participationService.joinChallenge(testChallenge.id, testEmployee.id);
      
      expect(testParticipation).toBeDefined();
      expect(testParticipation.challengeId).toBe(testChallenge.id);
      expect(testParticipation.employeeId).toBe(testEmployee.id);
      expect(testParticipation.approvalStatus).toBe('PENDING');
    });

    it('should reject joining the same challenge again (duplicate constraint)', async () => {
      await expect(
        participationService.joinChallenge(testChallenge.id, testEmployee.id)
      ).rejects.toThrow('Already joined this challenge');
    });

    it('should reject joining a non-ACTIVE challenge', async () => {
      // Create a DRAFT challenge
      const draftChallenge = await prisma.challenge.create({
        data: {
          title: 'Draft Challenge',
          categoryId: testCategory.id,
          description: 'Testing validation',
          xp: 100,
          difficulty: 'EASY',
          status: 'DRAFT',
          createdById: testEmployee.id
        }
      });

      await expect(
        participationService.joinChallenge(draftChallenge.id, testEmployee.id)
      ).rejects.toThrow('Can only join ACTIVE challenges');

      // Cleanup
      await prisma.challenge.delete({ where: { id: draftChallenge.id } });
    });
  });

  describe('updateProgress', () => {
    it('should successfully update progress for owned participation', async () => {
      const updated = await participationService.updateProgress(testParticipation.id, testEmployee.id, 50);
      expect(updated.progress).toBe(50);
    });

    it('should reject progress update if not the owner', async () => {
      await expect(
        participationService.updateProgress(testParticipation.id, 9999, 75)
      ).rejects.toThrow('Not authorized to update this participation');
    });
  });

  describe('attachProof', () => {
    it('should upload proof and set proofUrl', async () => {
      const buffer = Buffer.from('dummy-file-content');
      const updated = await participationService.attachProof(testParticipation.id, testEmployee.id, buffer);
      
      expect(updated.proofUrl).toBe('https://res.cloudinary.com/demo/image/upload/proof.jpg');
    });
  });

  describe('decideApproval', () => {
    it('should reject approval decision if not found', async () => {
      await expect(
        participationService.decideApproval(99999, 'APPROVED', testEmployee.id)
      ).rejects.toThrow('Participation not found');
    });

    it('should successfully reject participation', async () => {
      const updated = await participationService.decideApproval(testParticipation.id, 'REJECTED', testEmployee.id);
      expect(updated.approvalStatus).toBe('REJECTED');
    });

    it('should successfully approve participation, increment employee totalXp and write XP ledger entry', async () => {
      const initialEmployee = await prisma.employee.findUnique({ where: { id: testEmployee.id } });
      const initialXp = initialEmployee.totalXp;

      const updated = await participationService.decideApproval(testParticipation.id, 'APPROVED', testEmployee.id);
      
      expect(updated.approvalStatus).toBe('APPROVED');
      expect(updated.xpAwarded).toBe(250);

      // Verify employee XP incremented
      const finalEmployee = await prisma.employee.findUnique({ where: { id: testEmployee.id } });
      expect(finalEmployee.totalXp).toBe(initialXp + 250);

      // Verify XP ledger entry exists
      const xpLedger = await prisma.xpLedgerEntry.findFirst({
        where: {
          employeeId: testEmployee.id,
          sourceType: 'CHALLENGE',
          sourceId: testChallenge.id
        }
      });
      expect(xpLedger).toBeDefined();
      expect(xpLedger.points).toBe(250);
    });
  });

  describe('listParticipations', () => {
    it('should return paginated list of participations', async () => {
      const result = await participationService.listParticipations({ page: 1, limit: 10 });
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.meta.page).toBe(1);
    });
  });
});

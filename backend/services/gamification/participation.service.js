const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const badgeService = require('./badge.service');

// Placeholder notification service - will be implemented in commit 9
const notificationService = {
  notify: async (employeeId, type, payload) => {
    console.log(`Notification sent to employee ${employeeId}: ${type}`, payload);
  }
};

const joinChallenge = async (challengeId, employeeId) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  if (challenge.status !== 'ACTIVE') {
    throw new ApiError(400, 'Can only join ACTIVE challenges');
  }

  try {
    const participation = await prisma.challengeParticipation.create({
      data: {
        challengeId,
        employeeId
      },
      include: {
        challenge: true
      }
    });
    return participation;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ApiError(409, 'Already joined this challenge');
    }
    throw error;
  }
};

const updateProgress = async (participationId, employeeId, progress) => {
  const participation = await prisma.challengeParticipation.findUnique({
    where: { id: participationId }
  });

  if (!participation) {
    throw new ApiError(404, 'Participation not found');
  }

  if (participation.employeeId !== employeeId) {
    throw new ApiError(403, 'Not authorized to update this participation');
  }

  const clampedProgress = Math.max(0, Math.min(100, progress));

  const updated = await prisma.challengeParticipation.update({
    where: { id: participationId },
    data: { progress: clampedProgress }
  });

  return updated;
};

const attachProof = async (participationId, employeeId, fileBuffer) => {
  const participation = await prisma.challengeParticipation.findUnique({
    where: { id: participationId },
    include: {
      challenge: true
    }
  });

  if (!participation) {
    throw new ApiError(404, 'Participation not found');
  }

  if (participation.employeeId !== employeeId) {
    throw new ApiError(403, 'Not authorized to update this participation');
  }

  const proofUrl = await uploadToCloudinary(fileBuffer);

  const updated = await prisma.challengeParticipation.update({
    where: { id: participationId },
    data: { proofUrl }
  });

  return updated;
};

const decideApproval = async (participationId, decision, reviewerId) => {
  const participation = await prisma.challengeParticipation.findUnique({
    where: { id: participationId },
    include: {
      challenge: true,
      employee: true
    }
  });

  if (!participation) {
    throw new ApiError(404, 'Participation not found');
  }

  if (decision === 'APPROVED') {
    if (participation.challenge.evidenceRequired && !participation.proofUrl) {
      throw new ApiError(400, 'Proof required before approval');
    }

    await prisma.$transaction(async (tx) => {
      // Update participation
      await tx.challengeParticipation.update({
        where: { id: participationId },
        data: {
          approvalStatus: 'APPROVED',
          xpAwarded: participation.challenge.xp,
          completedAt: new Date()
        }
      });

      // Create XP ledger entry
      await tx.xpLedgerEntry.create({
        data: {
          employeeId: participation.employeeId,
          sourceType: 'CHALLENGE',
          sourceId: participation.challengeId,
          points: participation.challenge.xp
        }
      });

      // Increment employee total XP
      await tx.employee.update({
        where: { id: participation.employeeId },
        data: {
          totalXp: {
            increment: participation.challenge.xp
          }
        }
      });
    });

    // After transaction, call badge and notification services
    try {
      await badgeService.checkAndAwardBadges(participation.employeeId);
    } catch (error) {
      console.error('Badge check failed:', error);
    }

    await notificationService.notify(participation.employeeId, 'CHALLENGE_APPROVED', {
      challengeId: participation.challengeId,
      challengeTitle: participation.challenge.title,
      xpAwarded: participation.challenge.xp
    });
  } else if (decision === 'REJECTED') {
    await prisma.challengeParticipation.update({
      where: { id: participationId },
      data: { approvalStatus: 'REJECTED' }
    });

    await notificationService.notify(participation.employeeId, 'CHALLENGE_REJECTED', {
      challengeId: participation.challengeId,
      challengeTitle: participation.challenge.title
    });
  }

  return await prisma.challengeParticipation.findUnique({
    where: { id: participationId },
    include: {
      challenge: true,
      employee: true
    }
  });
};

const listParticipations = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [participations, total] = await Promise.all([
    prisma.challengeParticipation.findMany({
      skip,
      take: limit,
      include: {
        challenge: true,
        employee: true
      },
      orderBy: { joinedAt: 'desc' }
    }),
    prisma.challengeParticipation.count()
  ]);

  return {
    data: participations,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  joinChallenge,
  updateProgress,
  attachProof,
  decideApproval,
  listParticipations
};

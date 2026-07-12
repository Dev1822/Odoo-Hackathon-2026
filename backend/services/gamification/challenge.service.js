const prisma = require('../../config/db');
const { ApiError } = require('../../middlewares/errorHandler');
const { canTransition } = require('../../utils/stateMachine');

const createChallenge = async (data, creatorId) => {
  const challenge = await prisma.challenge.create({
    data: {
      ...data,
      status: 'DRAFT',
      createdById: creatorId
    },
    include: {
      category: true
    }
  });
  return challenge;
};

const listChallenges = async ({ status, categoryId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  
  const where = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      include: {
        category: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.challenge.count({ where })
  ]);

  return {
    data: challenges,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getChallengeById = async (id) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      category: true,
      participations: true
    }
  });

  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  return challenge;
};

const updateChallenge = async (id, data) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  if (challenge.status !== 'DRAFT') {
    throw new ApiError(400, 'Can only update challenges in DRAFT status');
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data,
    include: {
      category: true
    }
  });

  return updated;
};

const transitionStatus = async (id, newStatus) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  if (!canTransition(challenge.status, newStatus)) {
    throw new ApiError(400, `Cannot transition from ${challenge.status} to ${newStatus}`);
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: { status: newStatus },
    include: {
      category: true
    }
  });

  return updated;
};

const deleteChallenge = async (id) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      _count: {
        select: { participations: true }
      }
    }
  });

  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  if (challenge.status !== 'DRAFT') {
    throw new ApiError(400, 'Can only delete challenges in DRAFT status');
  }

  if (challenge._count.participations > 0) {
    throw new ApiError(400, 'Cannot delete challenge with existing participations');
  }

  await prisma.challenge.delete({
    where: { id }
  });

  return { message: 'Challenge deleted successfully' };
};

module.exports = {
  createChallenge,
  listChallenges,
  getChallengeById,
  updateChallenge,
  transitionStatus,
  deleteChallenge
};

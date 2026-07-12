const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function purge() {
  console.log('Purging all data from the database...');
  
  try {
    // Delete in order to satisfy foreign key constraints
    await prisma.notification.deleteMany({});
    console.log('Cleared Notifications');

    await prisma.xpLedgerEntry.deleteMany({});
    console.log('Cleared XP Ledger Entries');

    await prisma.rewardRedemption.deleteMany({});
    console.log('Cleared Reward Redemptions');

    await prisma.employeeBadge.deleteMany({});
    console.log('Cleared Employee Badges');

    await prisma.challengeParticipation.deleteMany({});
    console.log('Cleared Challenge Participations');

    await prisma.challenge.deleteMany({});
    console.log('Cleared Challenges');

    await prisma.reward.deleteMany({});
    console.log('Cleared Rewards');

    await prisma.badge.deleteMany({});
    console.log('Cleared Badges');

    await prisma.category.deleteMany({});
    console.log('Cleared Categories');

    await prisma.employee.deleteMany({});
    console.log('Cleared Employees');

    await prisma.department.deleteMany({});
    console.log('Cleared Departments');

    console.log('Database successfully cleared! All test data removed.');
  } catch (error) {
    console.error('Error purging database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

purge();

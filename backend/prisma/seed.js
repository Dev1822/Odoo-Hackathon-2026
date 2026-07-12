const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: 'Engineering', code: 'ENG' }
    }),
    prisma.department.create({
      data: { name: 'Marketing', code: 'MKT' }
    })
  ]);

  console.log('Created departments:', departments);

  // Create employees with mixed roles
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        departmentId: departments[0].id
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'MANAGER',
        departmentId: departments[0].id
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'EMPLOYEE',
        departmentId: departments[0].id
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Alice Williams',
        email: 'alice@example.com',
        role: 'EMPLOYEE',
        departmentId: departments[1].id
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'EMPLOYEE',
        departmentId: departments[1].id
      }
    })
  ]);

  console.log('Created employees:', employees);

  // Create categories (type=CHALLENGE)
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Sustainability', type: 'CHALLENGE', status: 'ACTIVE' }
    }),
    prisma.category.create({
      data: { name: 'Community Service', type: 'CHALLENGE', status: 'ACTIVE' }
    }),
    prisma.category.create({
      data: { name: 'Innovation', type: 'CHALLENGE', status: 'ACTIVE' }
    })
  ]);

  console.log('Created categories:', categories);

  // Create badges with varied unlockRule JSON
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'First Steps',
        description: 'Complete your first challenge',
        icon: '🎯',
        unlockRule: { metric: 'completedChallenges', operator: '>=', value: 1 }
      }
    }),
    prisma.badge.create({
      data: {
        name: 'XP Hunter',
        description: 'Earn 1000 total XP',
        icon: '⭐',
        unlockRule: { metric: 'totalXp', operator: '>=', value: 1000 }
      }
    }),
    prisma.badge.create({
      data: {
        name: 'Champion',
        description: 'Complete 10 challenges',
        icon: '🏆',
        unlockRule: { metric: 'completedChallenges', operator: '>=', value: 10 }
      }
    })
  ]);

  console.log('Created badges:', badges);

  // Create rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: 'Gift Card',
        description: '$50 Amazon gift card',
        pointsRequired: 500,
        stock: 10,
        status: 'ACTIVE'
      }
    }),
    prisma.reward.create({
      data: {
        name: 'Extra Day Off',
        description: 'One additional paid day off',
        pointsRequired: 1000,
        stock: 5,
        status: 'ACTIVE'
      }
    })
  ]);

  console.log('Created rewards:', rewards);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

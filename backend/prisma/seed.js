const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding clean testbed user accounts...');

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { id: 1, name: 'Engineering', code: 'ENG' }
    }),
    prisma.department.create({
      data: { id: 2, name: 'Marketing', code: 'MKT' }
    })
  ]);

  // Create clean employee records matching the frontend switcher IDs
  await Promise.all([
    prisma.employee.create({
      data: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN', departmentId: 1 }
    }),
    prisma.employee.create({
      data: { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER', departmentId: 1 }
    }),
    prisma.employee.create({
      data: { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'EMPLOYEE', departmentId: 1 }
    }),
    prisma.employee.create({
      data: { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'EMPLOYEE', departmentId: 2 }
    }),
    prisma.employee.create({
      data: { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'EMPLOYEE', departmentId: 2 }
    })
  ]);

  // Create default categories for challenges
  await Promise.all([
    prisma.category.create({
      data: { id: 1, name: 'Sustainability', type: 'CHALLENGE', status: 'ACTIVE' }
    }),
    prisma.category.create({
      data: { id: 2, name: 'Community Service', type: 'CHALLENGE', status: 'ACTIVE' }
    })
  ]);

  console.log('Clean seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

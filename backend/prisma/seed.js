const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ---- SHARED: Departments ----
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'ENG' },
      update: {},
      create: { id: 1, name: 'Engineering', code: 'ENG' }
    }),
    prisma.department.upsert({
      where: { code: 'MKT' },
      update: {},
      create: { id: 2, name: 'Marketing', code: 'MKT' }
    }),
    prisma.department.upsert({
      where: { code: 'OPS' },
      update: {},
      create: { id: 3, name: 'Operations', code: 'OPS' }
    }),
    prisma.department.upsert({
      where: { code: 'FIN' },
      update: {},
      create: { id: 4, name: 'Finance', code: 'FIN' }
    })
  ]);
  console.log('✓ Departments seeded');

  // ---- SHARED: Employees ----
  await Promise.all([
    prisma.employee.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN', departmentId: 1 }
    }),
    prisma.employee.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER', departmentId: 1 }
    }),
    prisma.employee.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'EMPLOYEE', departmentId: 1 }
    }),
    prisma.employee.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'EMPLOYEE', departmentId: 2 }
    }),
    prisma.employee.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'EMPLOYEE', departmentId: 2 }
    }),
    prisma.employee.upsert({
      where: { email: 'priya@example.com' },
      update: {},
      create: { id: 6, name: 'Priya Sharma', email: 'priya@example.com', role: 'MANAGER', departmentId: 3 }
    }),
    prisma.employee.upsert({
      where: { email: 'raj@example.com' },
      update: {},
      create: { id: 7, name: 'Raj Patel', email: 'raj@example.com', role: 'EMPLOYEE', departmentId: 4 }
    })
  ]);
  console.log('✓ Employees seeded');

  // ---- SHARED: Categories (Gamification + Environmental) ----
  await Promise.all([
    prisma.category.upsert({
      where: { name_type: { name: 'Sustainability', type: 'CHALLENGE' } },
      update: {},
      create: { id: 1, name: 'Sustainability', type: 'CHALLENGE', status: 'ACTIVE' }
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Community Service', type: 'CHALLENGE' } },
      update: {},
      create: { id: 2, name: 'Community Service', type: 'CHALLENGE', status: 'ACTIVE' }
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Energy', type: 'EMISSION_FACTOR' } },
      update: {},
      create: { id: 3, name: 'Energy', type: 'EMISSION_FACTOR', status: 'ACTIVE' }
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Transport', type: 'EMISSION_FACTOR' } },
      update: {},
      create: { id: 4, name: 'Transport', type: 'EMISSION_FACTOR', status: 'ACTIVE' }
    }),
    prisma.category.upsert({
      where: { name_type: { name: 'Water', type: 'EMISSION_FACTOR' } },
      update: {},
      create: { id: 5, name: 'Water', type: 'EMISSION_FACTOR', status: 'ACTIVE' }
    })
  ]);
  console.log('✓ Categories seeded');

  // ---- ENVIRONMENTAL: Emission Factors ----
  const emissionFactors = await Promise.all([
    prisma.emissionFactor.create({
      data: {
        id: 1,
        categoryId: 3, // Energy
        name: 'Grid Electricity (India)',
        unit: 'kgCO2e/kWh',
        factorValue: 0.716000,
        source: 'CEA CO2 Database 2025',
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        status: 'ACTIVE'
      }
    }),
    prisma.emissionFactor.create({
      data: {
        id: 2,
        categoryId: 4, // Transport
        name: 'Diesel Fuel',
        unit: 'kgCO2e/liter',
        factorValue: 2.687000,
        source: 'DEFRA 2025',
        validFrom: new Date('2025-01-01'),
        validTo: null,
        status: 'ACTIVE'
      }
    }),
    prisma.emissionFactor.create({
      data: {
        id: 3,
        categoryId: 5, // Water
        name: 'Municipal Water Supply',
        unit: 'kgCO2e/m3',
        factorValue: 0.344000,
        source: 'IPCC 2025',
        validFrom: new Date('2025-01-01'),
        validTo: null,
        status: 'ACTIVE'
      }
    })
  ]);
  console.log('✓ Emission Factors seeded');

  // ---- ENVIRONMENTAL: Product ESG Profiles ----
  await Promise.all([
    prisma.productEsgProfile.create({
      data: {
        id: 1,
        productName: 'Eco-Friendly Packaging',
        productCode: 'PKG-ECO-001',
        carbonFootprint: 1.2500,
        recyclable: true,
        notes: 'Biodegradable packaging made from sugarcane bagasse. Certified compostable.'
      }
    }),
    prisma.productEsgProfile.create({
      data: {
        id: 2,
        productName: 'Standard Plastic Container',
        productCode: 'PKG-STD-002',
        carbonFootprint: 4.8000,
        recyclable: false,
        notes: 'PVC-based container. Phase-out planned by Q4 2026.'
      }
    })
  ]);
  console.log('✓ Product ESG Profiles seeded');

  // ---- ENVIRONMENTAL: Carbon Transactions (spread across departments and months) ----
  const now = new Date();
  await Promise.all([
    prisma.carbonTransaction.create({
      data: {
        departmentId: 1, // Engineering
        emissionFactorId: 1, // Electricity
        sourceModule: 'MANUAL',
        quantity: 1500.0000,
        calculatedCo2e: 1074.0000, // 1500 * 0.716
        autoCalculated: false,
        transactionDate: new Date(now.getFullYear(), now.getMonth() - 3, 15)
      }
    }),
    prisma.carbonTransaction.create({
      data: {
        departmentId: 1, // Engineering
        emissionFactorId: 2, // Diesel
        sourceModule: 'FLEET',
        quantity: 200.0000,
        calculatedCo2e: 537.4000, // 200 * 2.687
        autoCalculated: true,
        transactionDate: new Date(now.getFullYear(), now.getMonth() - 2, 10)
      }
    }),
    prisma.carbonTransaction.create({
      data: {
        departmentId: 2, // Marketing
        emissionFactorId: 1, // Electricity
        sourceModule: 'MANUAL',
        quantity: 800.0000,
        calculatedCo2e: 572.8000, // 800 * 0.716
        autoCalculated: false,
        transactionDate: new Date(now.getFullYear(), now.getMonth() - 1, 5)
      }
    }),
    prisma.carbonTransaction.create({
      data: {
        departmentId: 3, // Operations
        emissionFactorId: 2, // Diesel
        productId: 2, // Standard Plastic Container
        sourceModule: 'MANUFACTURING',
        quantity: 350.0000,
        calculatedCo2e: 940.4500, // 350 * 2.687
        autoCalculated: true,
        transactionDate: new Date(now.getFullYear(), now.getMonth() - 1, 20)
      }
    }),
    prisma.carbonTransaction.create({
      data: {
        departmentId: 4, // Finance
        emissionFactorId: 3, // Water
        sourceModule: 'EXPENSE',
        quantity: 500.0000,
        calculatedCo2e: 172.0000, // 500 * 0.344
        autoCalculated: true,
        transactionDate: new Date(now.getFullYear(), now.getMonth(), 1)
      }
    })
  ]);
  console.log('✓ Carbon Transactions seeded');

  // ---- ENVIRONMENTAL: Environmental Goals ----
  await Promise.all([
    prisma.environmentalGoal.create({
      data: {
        name: 'Reduce Fleet Emissions',
        departmentId: 1,
        targetCo2e: 800.0000,
        currentCo2e: 537.4000,
        deadline: new Date(now.getFullYear(), 11, 31), // End of year
        status: 'ON_TRACK'
      }
    }),
    prisma.environmentalGoal.create({
      data: {
        name: 'Cut Packaging Waste',
        departmentId: 3,
        targetCo2e: 500.0000,
        currentCo2e: 940.4500,
        deadline: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        status: 'AT_RISK'
      }
    }),
    prisma.environmentalGoal.create({
      data: {
        name: 'Office Energy Cut',
        departmentId: 2,
        targetCo2e: 400.0000,
        currentCo2e: 572.8000,
        deadline: new Date(now.getFullYear() + 1, 2, 31),
        status: 'ACTIVE'
      }
    })
  ]);
  console.log('✓ Environmental Goals seeded');

  // ---- SHARED: Department Scores (placeholder values) ----
  await Promise.all([
    prisma.departmentScore.create({
      data: { departmentId: 1, environmentalScore: 72.50, socialScore: 0, governanceScore: 0, totalScore: 29.00 }
    }),
    prisma.departmentScore.create({
      data: { departmentId: 2, environmentalScore: 58.00, socialScore: 0, governanceScore: 0, totalScore: 23.20 }
    }),
    prisma.departmentScore.create({
      data: { departmentId: 3, environmentalScore: 35.00, socialScore: 0, governanceScore: 0, totalScore: 14.00 }
    }),
    prisma.departmentScore.create({
      data: { departmentId: 4, environmentalScore: 65.00, socialScore: 0, governanceScore: 0, totalScore: 26.00 }
    })
  ]);
  console.log('✓ Department Scores seeded');

  console.log('\n✅ All seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

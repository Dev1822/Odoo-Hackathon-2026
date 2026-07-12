const prisma = require('../config/db');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

/**
 * Fetch report data in a format-agnostic way.
 */
const fetchReportData = async ({ departmentId, dateFrom, dateTo }) => {
  const whereTx = {
    transactionDate: {
      gte: new Date(dateFrom),
      lte: new Date(dateTo)
    }
  };
  if (departmentId) {
    whereTx.departmentId = departmentId;
  }

  const whereGoal = {
    createdAt: {
      gte: new Date(dateFrom),
      lte: new Date(dateTo)
    }
  };
  if (departmentId) {
    whereGoal.departmentId = departmentId;
  }

  const [transactions, goals] = await Promise.all([
    prisma.carbonTransaction.findMany({
      where: whereTx,
      include: {
        department: true,
        emissionFactor: true,
        product: true
      },
      orderBy: { transactionDate: 'asc' }
    }),
    prisma.environmentalGoal.findMany({
      where: whereGoal,
      include: { department: true },
      orderBy: { deadline: 'asc' }
    })
  ]);

  return {
    transactions,
    goals,
    dateFrom,
    dateTo
  };
};

/**
 * Generate CSV and write to writable stream.
 */
const generateCSV = (reportData, writeStream) => {
  const lines = [];
  
  // Title / Metadata
  lines.push(`Environmental ESG Report`);
  lines.push(`Period: ${reportData.dateFrom} to ${reportData.dateTo}`);
  lines.push('');

  // Transactions Section
  lines.push('CARBON TRANSACTIONS');
  lines.push('ID,Date,Department,Source Module,Quantity,Unit,Calculated CO2e (kgCO2e),Auto-Calculated');
  reportData.transactions.forEach(t => {
    lines.push([
      t.id,
      t.transactionDate.toISOString().split('T')[0],
      t.department.name,
      t.sourceModule,
      t.quantity,
      t.emissionFactor.unit,
      t.calculatedCo2e,
      t.autoCalculated ? 'YES' : 'NO'
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
  });

  lines.push('');
  lines.push('');

  // Goals Section
  lines.push('ENVIRONMENTAL GOALS');
  lines.push('ID,Goal Name,Department,Target CO2e (kgCO2e),Current CO2e (kgCO2e),Deadline,Status');
  reportData.goals.forEach(g => {
    lines.push([
      g.id,
      g.name,
      g.department.name,
      g.targetCo2e,
      g.currentCo2e,
      g.deadline.toISOString().split('T')[0],
      g.status
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
  });

  writeStream.write(lines.join('\n'));
  writeStream.end();
};

/**
 * Generate Excel and write to writable stream.
 */
const generateExcel = async (reportData, writeStream) => {
  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Carbon Transactions
  const txSheet = workbook.addWorksheet('Carbon Transactions');
  txSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Source Module', key: 'sourceModule', width: 15 },
    { header: 'Quantity', key: 'quantity', width: 15 },
    { header: 'Unit', key: 'unit', width: 15 },
    { header: 'Calculated CO2e (kg)', key: 'calculatedCo2e', width: 22 },
    { header: 'Auto-Calculated', key: 'autoCalculated', width: 18 }
  ];

  reportData.transactions.forEach(t => {
    txSheet.addRow({
      id: t.id,
      date: t.transactionDate.toISOString().split('T')[0],
      department: t.department.name,
      sourceModule: t.sourceModule,
      quantity: parseFloat(t.quantity),
      unit: t.emissionFactor.unit,
      calculatedCo2e: parseFloat(t.calculatedCo2e),
      autoCalculated: t.autoCalculated ? 'Yes' : 'No'
    });
  });

  // Sheet 2: Environmental Goals
  const goalSheet = workbook.addWorksheet('Environmental Goals');
  goalSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Goal Name', key: 'name', width: 25 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Target CO2e (kg)', key: 'targetCo2e', width: 18 },
    { header: 'Current CO2e (kg)', key: 'currentCo2e', width: 18 },
    { header: 'Deadline', key: 'deadline', width: 15 },
    { header: 'Status', key: 'status', width: 15 }
  ];

  reportData.goals.forEach(g => {
    goalSheet.addRow({
      id: g.id,
      name: g.name,
      department: g.department.name,
      targetCo2e: parseFloat(g.targetCo2e),
      currentCo2e: parseFloat(g.currentCo2e),
      deadline: g.deadline.toISOString().split('T')[0],
      status: g.status
    });
  });

  await workbook.xlsx.write(writeStream);
};

/**
 * Generate PDF and write to writable stream.
 */
const generatePDF = (reportData, writeStream) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(writeStream);

  // Title
  doc.fontSize(24).font('Helvetica-Bold').text('Environmental ESG Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica').text(`Reporting Period: ${reportData.dateFrom} to ${reportData.dateTo}`, { align: 'center' });
  doc.moveDown(2);

  // Transactions Header
  doc.fontSize(16).font('Helvetica-Bold').text('Carbon Transactions', { underline: true });
  doc.moveDown(0.5);

  reportData.transactions.forEach((t, i) => {
    doc.fontSize(10).font('Helvetica-Bold').text(`Transaction #${t.id} - ${t.transactionDate.toISOString().split('T')[0]}`);
    doc.font('Helvetica')
       .text(`  Department: ${t.department.name}`)
       .text(`  Source Module: ${t.sourceModule}`)
       .text(`  Quantity: ${t.quantity} ${t.emissionFactor.unit}`)
       .text(`  Calculated CO2e: ${parseFloat(t.calculatedCo2e).toFixed(2)} kgCO2e`)
       .text(`  Auto-Calculated: ${t.autoCalculated ? 'Yes' : 'No'}`);
    doc.moveDown(0.5);

    // Page budget check
    if (doc.y > 650) {
      doc.addPage();
    }
  });

  doc.addPage();

  // Goals Header
  doc.fontSize(16).font('Helvetica-Bold').text('Environmental Goals', { underline: true });
  doc.moveDown(0.5);

  reportData.goals.forEach((g) => {
    doc.fontSize(10).font('Helvetica-Bold').text(`Goal: ${g.name}`);
    doc.font('Helvetica')
       .text(`  Department: ${g.department.name}`)
       .text(`  Target CO2e: ${parseFloat(g.targetCo2e).toFixed(2)} kgCO2e`)
       .text(`  Current CO2e: ${parseFloat(g.currentCo2e).toFixed(2)} kgCO2e`)
       .text(`  Deadline: ${g.deadline.toISOString().split('T')[0]}`)
       .text(`  Status: ${g.status}`);
    doc.moveDown(0.5);

    if (doc.y > 650) {
      doc.addPage();
    }
  });

  doc.end();
};

const buildEnvironmentalReport = async ({ departmentId, dateFrom, dateTo, format, writeStream }) => {
  const reportData = await fetchReportData({ departmentId, dateFrom, dateTo });

  if (format === 'csv') {
    generateCSV(reportData, writeStream);
  } else if (format === 'excel') {
    await generateExcel(reportData, writeStream);
  } else if (format === 'pdf') {
    generatePDF(reportData, writeStream);
  } else {
    throw new Error('Unsupported format type');
  }
};

module.exports = {
  buildEnvironmentalReport
};

const asyncHandler = require('../../utils/asyncHandler.gamification');
const reportService = require('../../services/report.service');

const getEnvironmentalReport = asyncHandler(async (req, res) => {
  const { departmentId, dateFrom, dateTo, format } = req.query;

  // Set response headers depending on format
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="environmental_report.csv"');
  } else if (format === 'excel') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="environmental_report.xlsx"');
  } else if (format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="environmental_report.pdf"');
  }

  await reportService.buildEnvironmentalReport({
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    dateFrom,
    dateTo,
    format,
    writeStream: res
  });
});

module.exports = {
  getEnvironmentalReport
};

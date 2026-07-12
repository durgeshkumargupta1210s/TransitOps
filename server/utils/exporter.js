const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const PDFDocument = require('pdfkit');

exports.csvFromArray = (records, headers) => {
  const csvWriter = createCsvWriter({ header: headers });
  return csvWriter.stringifyRecords(records);
}

exports.pdfBufferFromText = async (title, rows) => {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  rows.forEach(row => {
    doc.fontSize(10).text(JSON.stringify(row));
    doc.moveDown(0.2);
  });
  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

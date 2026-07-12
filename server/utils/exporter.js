const {
  createObjectCsvStringifier,
} = require("csv-writer");

const PDFDocument = require("pdfkit");

// =============================
// CSV EXPORT
// =============================
exports.csvFromArray = (records, headers) => {
  const csv = createObjectCsvStringifier({
    header: headers,
  });

  return (
    csv.getHeaderString() +
    csv.stringifyRecords(records)
  );
};

// =============================
// PDF EXPORT
// =============================
exports.pdfBufferFromText = (title, rows) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
      });

      const buffers = [];

      doc.on("data", (chunk) =>
        buffers.push(chunk)
      );

      doc.on("end", () =>
        resolve(Buffer.concat(buffers))
      );

      doc.fontSize(22)
        .text(title, {
          align: "center",
        });

      doc.moveDown();

      rows.forEach((row, index) => {
        doc
          .fontSize(11)
          .text(`${index + 1}.`);

        Object.entries(row).forEach(([key, value]) => {
          doc.text(
            `${key}: ${value ?? "-"}`
          );
        });

        doc.moveDown();
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
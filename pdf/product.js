// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const PDFDocument = require("pdfkit");
const PdfTable = require("voilab-pdf-table");

const generatePDF = (data) => {
  // Create a PDF document
  const pdf = new PDFDocument();
  const table = new PdfTable(pdf, {
    bottomMargin: 30,
  });

  const imageWidth = 150;

  // Calculate the x-position to center the image
  const centerX = (pdf.page.width - imageWidth) / 2;

  pdf.image("pdf/logo.jpg", centerX, pdf.y, { width: 150, align: "center" });

  // Add footer with company address
  pdf.text("Kitchener, ON", { align: "center" });

  // Add footer with company address
  pdf.text("Your Company Address", { align: "center" });

  // Add content to the PDF
  pdf.text("Product List", { align: "center", fontSize: 18, margin: 10 });
  pdf.moveDown();

  table
    .addPlugin(
      new (require("voilab-pdf-table/plugins/fitcolumn"))({
        column: "description",
      })
    )
    .setColumnsDefaults({
      headerBorder: "B",
      align: "right",
    })
    .addColumns([
      {
        id: "product_name",
        header: "Product",
        align: "left",
        width: 80,
      },
      {
        id: "category",
        header: "Category",
        align: "left",
        width: 80,
      },
      {
        id: "quantity",
        header: "Quantity",
        align: "center",
        width: 50,
      },
      {
        id: "price",
        header: "Price",
        width: 60,
      },
      {
        id: "manuDate",
        header: "Manufacture Date",
        align: "center",
        width: 100,
      },
      {
        id: "expDate",
        header: "Expiry Date",
        align: "center",
        width: 80,
      },
      {
        id: "total",
        header: "Total",
        width: 70,
        renderer: function (tb, data) {
          return data.total;
        },
      },
    ])
    .onPageAdded(function (tb) {
      tb.addHeader();
    });

  // Add rows to the table
  table.addBody(
    data.map((product) => {
      const quantity = isNaN(product.quantity) ? 0 : product.quantity;
      const price = isNaN(product.price) ? 0 : product.price;

      const manufacDate = product.mfg_date.toISOString().split("T")[0];
      const expDate = product.expiry_date.toISOString().split("T")[0];

      return {
        product_name: product.product_name,
        category: product.category,
        quantity: quantity,
        price: price,
        manuDate: manufacDate,
        expDate: expDate,
        total: quantity * price,
      };
    })
  );

  pdf.x = 75;
  pdf.moveDown(5);
  pdf.text("Ashish Neupane - 8897734", { align: "left" });
  pdf.text("Nandipati Vamsi - 8922647", { align: "left" });
  pdf.text("Bipin Gurung - 8899022", { align: "left" });

  return pdf;
};

module.exports = generatePDF;

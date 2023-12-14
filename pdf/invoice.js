// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

const PDFDocument = require("pdfkit");
const PdfTable = require("voilab-pdf-table");

const generateInvoice = async (data, totalPrice, totalTax) => {
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

  // Add content to the PDF
  pdf.text("Transaction Details", {
    align: "center",
    fontSize: 18,
    margin: 10,
  });
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
        id: "customer_name",
        header: "Customer Name",
        align: "left",
        width: 80,
      },
      {
        id: "email",
        header: "Email",
        align: "left",
        width: 80,
      },
      {
        id: "machine_location",
        header: "Machine Location",
        align: "left",
        width: 80,
      },
      {
        id: "product_name",
        header: "Product",
        align: "left",
        width: 80,
      },
      {
        id: "quantity",
        header: "Quantity",
        align: "center",
        width: 30,
      },
      {
        id: "total_price",
        header: "Total Price",
        width: 50,
      },
      {
        id: "payment_type",
        header: "Payment Type",
        width: 50,
      },
      {
        id: "transaction_timestamp",
        header: "Transaction Timestamp",
        align: "center",
        width: 80,
      },
    ])
    .onPageAdded(function (tb) {
      tb.addHeader();
    });

  // Add rows to the table
  table.addBody(
    data.map((transactionData) => {
      const transaction_timestamp = transactionData.transaction_timestamp
        .toISOString()
        .split("T")[0];

      console.log(transactionData, "data", transactionData.customer_name);
      return {
        customer_name: transactionData.customer_name,
        email: transactionData.email,
        machine_location: transactionData.machine_location,
        product_name: transactionData.product_name,
        quantity: transactionData.quantity,
        total_price: transactionData.total_price,
        payment_type: transactionData.payment_type,
        transaction_timestamp,
      };
    })
  );

  pdf.moveDown(5);
  pdf.x = 350;

  // Add total price and total tax after the table
  pdf.text(` Total Price (without TAX): $ ${totalPrice}`);
  pdf.text(`Total TAX: $ ${totalTax}`);
  pdf.text(`Total Price: $ ${Number(totalPrice) + Number(totalTax)}`);

  pdf.x = 75;
  pdf.moveDown(5);
  pdf.text("Ashish Neupane - 8897734", { align: "left" });
  pdf.text("Nandipati Vamsi - 8922647", { align: "left" });
  pdf.text("Bipin Gurung - 8899022", { align: "left" });
  return pdf;
};

module.exports = generateInvoice;

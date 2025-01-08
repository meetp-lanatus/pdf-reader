const path = require("path");
const {
  parseRowsToObjects,
  extractTableData,
  extractMultipleTableData,
} = require("../utils/extractData");

// Order Data
const OrderData = async () => {
  const OrderFilePath = path.resolve(
    __dirname,
    "../pdf/dairy-freezer smart retail order 20-12.pdf"
  );
  const ExtractedOrderData = await extractTableData(OrderFilePath);
  const result = parseRowsToObjects(ExtractedOrderData);
  return result;
};

// InvoiceData
const InvoiceData = async () => {
  const InvoiceFilePaths = [
    path.resolve(
      __dirname,
      "../pdf/dairy-freezer askross invoice  20-12-1.pdf"
    ),
    path.resolve(
      __dirname,
      "../pdf/dairy-freezer askross invoice  20-12-2.pdf"
    ),
  ];
  const ExtractedInvoiceData = await extractMultipleTableData(InvoiceFilePaths);
  const result = parseRowsToObjects(ExtractedInvoiceData);
  return result;
};

module.exports = {
  OrderData,
  InvoiceData,
};

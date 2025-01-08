const PdfReader = require("pdfreader").PdfReader;

// Extract Table Data from a PDF file
const extractTableData = (filePath) => {
  return new Promise((resolve) => {
    const rows = [];
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) {
        console.error("Error reading PDF:", err);
        resolve([]);
      } else if (!item) resolve(rows);
      else if (item.text) rows.push(item.text.trim());
    });
  });
};

// Extract Multiple PDFs
const extractMultipleTableData = async (filePaths) => {
  const allData = [];
  for (const filePath of filePaths) {
    const fileData = await extractTableData(filePath);
    allData.push(...fileData);
  }
  return allData;
};

//  Data
const parseRowsToObjects = (rows) => {
  const parsedData = [];

  rows.forEach((row, index) => {
    if (/^00\d{6}$/.test(row.trim())) {
      const currentRow = {
        OrderCode: row.trim(), // Order Code
        Barcode: rows[index + 1] || "", // Barcode
        Description: rows[index + 2] || "", // Description
        Qty: parseFloat(rows[index + 3]) || 0, // Qty
        ExtCost: parseFloat(rows[index + 4]) || 0, // ExtCost
        Units: parseFloat(rows[index + 5]) || 0, // Units
        Cost: parseFloat(rows[index + 6]) || 0, // Cost
        CtnQty: parseFloat(rows[index + 7]) || 0, // CtnQty
        SupplierReference: rows[index + 8] || "", // SupplierReference
      };
      parsedData.push(currentRow); // Add the new row to parsedData
    } else if (/^00\d{3}$/.test(row.trim())) {
      const hasIndicator =
        /^[A-Za-z ]+$/.test(rows[index + 3]?.trim() || "") &&
        /^\d+(\.\d+)?$/.test(rows[index + 4]?.trim() || ""); // Check if the indicator exists and is a valid string
      const currentRow = {
        lineNumber: row.trim(), // Line number
        productId: rows[index + 1] || "", // Product ID
        productDescription: rows[index + 2] || "", // Product description
        indicator: hasIndicator ? rows[index + 3] : "", // Indicator (IND), only if valid
        quantity: parseFloat(rows[index + (hasIndicator ? 4 : 3)]) || 0, // Quantity (Qty)
        unitOfMeasure: rows[index + (hasIndicator ? 5 : 4)] || "", // Unit of Measure (UOM)
        packQuantity: parseFloat(rows[index + (hasIndicator ? 6 : 5)]) || 0, // Pack Quantity (Pack_Qty)
        weight: parseFloat(rows[index + (hasIndicator ? 7 : 6)]) || 0, // Weight
        gstPercentage: parseFloat(rows[index + (hasIndicator ? 8 : 7)]) || 0, // GST Percentage (GST)
        unitCost: parseFloat(rows[index + (hasIndicator ? 9 : 8)]) || 0, // Unit Cost (Cost)
        marginPercentage:
          parseFloat(rows[index + (hasIndicator ? 10 : 9)]) || 0, // Margin Percentage (Mrgn)
        gstAmount: parseFloat(rows[index + (hasIndicator ? 11 : 10)]) || 0, // GST Amount
        totalCost: parseFloat(rows[index + (hasIndicator ? 12 : 11)]) || 0, // Total Cost
        totalValueExtended:
          parseFloat(rows[index + (hasIndicator ? 13 : 12)]) || 0, // Total Value (Extended)
        landedUnitCost: parseFloat(rows[index + (hasIndicator ? 14 : 13)]) || 0, // Landed Unit Cost
        suggestedSellingPrice:
          parseFloat(rows[index + (hasIndicator ? 15 : 14)]) || 0, // Suggested Selling Price (Sugg_Sell)
        grossProfitPercentage:
          parseFloat(rows[index + (hasIndicator ? 16 : 15)]) || 0, // Gross Profit Percentage (Gp)
      };
      parsedData.push(currentRow); // Add the new row to parsedData
    }
  });

  return parsedData;
};

module.exports = {
  extractTableData,
  extractMultipleTableData,
  parseRowsToObjects,
};

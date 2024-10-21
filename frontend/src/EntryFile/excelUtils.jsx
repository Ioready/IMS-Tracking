import * as XLSX from 'xlsx';

const handleExcelDownload = (data, columnTitles) => {
  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(columnTitles) || columnTitles.length === 0) {
    console.error('Invalid data or columnTitles provided.');
    return;
  }

  // Sort data by "Product Name" before creating Excel file
  data.sort((a, b) => {
    const nameA = a['productName'] ? a['productName'].toUpperCase() : ''; // Change 'productName' to the actual key
    const nameB = b['productName'] ? b['productName'].toUpperCase() : ''; // Change 'productName' to the actual key
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  // Create a new array for Excel data
  const excelData = [];

  // Add headers as the first row
  excelData.push(columnTitles);

  // Add data rows
  data.forEach((item) => {
    const row = [];
    columnTitles.forEach((title) => {
      row.push(item[title] ?? ''); // Use nullish coalescing to handle missing keys
    });
    excelData.push(row);
  });

  // Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, 'table_data.xlsx');
};

export default handleExcelDownload;
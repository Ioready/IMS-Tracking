/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Printer,
  Search
} from "../EntryFile/imagePath";
import PDFGenerator from "./PDFGenerator";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import handleExcelDownload from "./excelUtils";

const Tabletop = ({ data, columnTitles, inputfilter, togglefilter, onFilter,filtering }) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(data);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!Array.isArray(data)) {
        console.error('Data is not defined or not an array.');
        return;
    }
    // Filter the data
    const search = data.filter((item) => {
        return Object.values(item).some((value) => {
            if (value !== null && value !== undefined) {
                return value.toString().toLowerCase().includes(searchValue.toLowerCase());
            }
            return false;
        });
    });
    // Call the onFilter function with the filtered data
    console.log('filtered: ', search);
    onFilter(search);
};
  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('table_data.pdf');
    });
  };

  // const handleDownloadExcel = () => {
  //   data.sort((a, b) => a.id - b.id);

  //   handleExcelDownload(data, columnTitles);
  //   // Sample data (replace this with your actual data)
  //   // const excelData = [];

  //   // // Add headers as the first row
  //   // excelData.push(columnTitles);
  
  //   // // Add data rows
  //   // data.forEach((item) => {
  //   //   const row = [];
  //   //   Object.keys(item).forEach((key) => {
  //   //     row.push(item[key]);
  //   //   });
  //   //   excelData.push(row);
  //   // });
  
  //   // // Create a worksheet
  //   // const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  //   // // Create a new workbook
  //   // const wb = XLSX.utils.book_new();
  
  //   // // Add the worksheet to the workbook
  //   // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  //   // // Generate Excel file and trigger download
  //   // XLSX.writeFile(wb, 'table_data.xlsx');
  // };

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="table-top">
      <div className="search-set">
        <div className="search-path">
       
         <a
            className="btn-filter"
            href="#"
            id="filter_search"
          onClick={() => togglefilter(!inputfilter)}
          >
            <img src={Filter} alt="img" />
            <span>
              <img src={ClosesIcon} alt="img" />
            </span>
          </a>

        </div>
        <div className="search-input">
          <input
            className="form-control form-control-sm search-icon"
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Link to="#" className="btn btn-searchset">
            <img src={Search} alt="img" />
          </Link>
        </div>
      </div>
      <div className="wordset">
        <ul>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <li>
            <Link type="button" to="#" onClick={handlePdfDownload}>
              <a data-tip="Pdf">
                <img src={Pdf} alt="img" />
              </a>
            </Link>
          </li>
          {/* <li>
            <a data-tip="Excel" onClick={handleDownloadExcel}>
              <img src={Excel} alt="img" />
            </a>
          </li> */}
          <li>
            <a data-tip="Print" onClick={handlePrint}>
              <img src={Printer} alt="img" />
            </a>
          </li>
        </ul>
        <PDFGenerator data={data} columnTitles={columnTitles}/>
      </div>
    </div>
  );
};

export default Tabletop;

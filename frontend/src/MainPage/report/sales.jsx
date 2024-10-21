/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import * as XLSX from 'xlsx';
import { pdfjs } from 'react-pdf';
import html2canvas from 'html2canvas';
import "react-datepicker/dist/react-datepicker.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Calendar,
  Printer,
  search_whites,
  Search,
  MacbookIcon,
  OrangeImage,
  PineappleImage,
  StawberryImage,
  AvocatImage,
  Product1,
  Product7,
  Product8,
  Product9,
  EyeIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { peopleUrl, productUrl } from "../../Apis/Api";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Sales = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDate1, setStartDate1] = useState(new Date());
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inputfilter, setInputfilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [productData, setProductData] = useState([])

  const products = async () => {
    try {
      await axios.get(`${productUrl}`).then((response) => {
        const datas = response.data
        setProductData(datas)
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    products()
  }, [])

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/category-list`);
        const categoryData = response.data.categoryData;
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const clearFilters = () => {
    setSelectedProduct("1");
    setSelectedCategory("1");
    setSelectedSubCategory("1");
    setSelectedBrand("1");
  };

  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${productUrl}/brand-list`);
        const brandData = response.data.brandData;
        setBrands(brandData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/sub-category-list`);
        const subCategoryData = response.data.subCategoryData;
        setSubCategories(subCategoryData);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  const [data, setData] = useState([]);

  const options = [
    { id: "1", text: "Choose Product" },
    ...productData.map((product) => ({ id: product.productName, text: product.productName })),
  ];

  const options2 = [
    { id: "1", text: "Choose Category" },
    ...categories.map((category) => ({
      id: category.categoryName,
      text: category.categoryName,
    })),
  ];

  const options3 = [
    { id: "1", text: "Choose Sub Category" },
    ...subCategories.map((subCategory) => ({
      id: subCategory.subCategoryName,
      text: subCategory.subCategoryName,
    })),
  ];

  const options4 = [
    { id: "1", text: "Brand" },
    ...brands.map((brand) => ({
      id: brand.brandName,
      text: brand.brandName,
    })),
  ];

  const [selectedProduct, setSelectedProduct] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedSubCategory, setSelectedSubCategory] = useState("1");
  const [selectedBrand, setSelectedBrand] = useState("1");


  const togglefilter = (value) => {
    setInputfilter(value);
  };

  useEffect(() => {
    const salesReport = async () => {
      try {
        await axios.get(`${peopleUrl}/get-sales-report`).then((response) => {
          const datas = response.data
          console.log("datas", datas)
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    salesReport()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData(filteredDatas)
    }
    fetchData()
  }, [data, searchTerm]);


  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('sales_report.pdf');
    });
  };

  const handleExcelDownload = () => {
    // Sample data (replace this with your actual data)
    const datas = [
      ['Product Name', 'SKU', 'Category', 'Brand', 'Sold Amount', 'Sold QTY', 'Instock QTY'],
      ...data.map((item) => [
        item.productNames,
        item.skuList,
        item.category,
        item.brand,
        item.soldAmount,
        item.soldQty,
        item.instockQty
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'sales_report.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();
  
    if (selectedProduct && selectedProduct !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.productNames.includes(selectedProduct)
      );
    }
  
    if (selectedCategory && selectedCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }
  
    if (selectedSubCategory && selectedSubCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.subCategory === selectedSubCategory
      );
    }
  
    if (selectedBrand && selectedBrand !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === selectedBrand
      );
    }
  
    setFilteredData(filteredProducts);
  };
  

  useEffect(() => {
    handleFilter();
  }, [data, selectedProduct, selectedCategory, selectedSubCategory, selectedBrand]);


  const columns = [
    {
      title: "Product Name",
      dataIndex: "productNames",
      render: (text) => text ? text.join(', ') : '',
      sorter: (a, b) => {
        if (a.productNames && b.productNames) {
          return a.productNames[0].localeCompare(b.productNames[0]);
        }
        return 0;
      },
      key: 'productNames',
    },
    {
      title: "SKU",
      dataIndex: "skuList",
      render: (text) => text ? text.join(', ') : '',
      sorter: (a, b) => {
        if (a.skuList && b.skuList) {
          return a.skuList[0].localeCompare(b.skuList[0]);
        }
        return 0;
      },
      key: 'skuList'
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      key: 'category'
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      key: 'brand'
    },
    {
      title: "Sold Amount",
      dataIndex: "soldAmount",
      sorter: (a, b) => a.soldAmount - b.soldAmount,
      key: 'soldAmount'
    },
    {
      title: "Sold QTY",
      dataIndex: "soldQty",
      sorter: (a, b) => a.soldQty - b.soldQty,
      key: 'soldQty'
    },
    {
      title: "Instock QTY",
      dataIndex: "instockQty",
      render: (_, record) => record?.qty - record?.soldQty,
      sorter: (a, b) => (a.qty - a.soldQty) - (b.qty - b.soldQty),
      key: 'instockQty'
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/report/sales-details/${record.productNames}/${record.skuList}/${record.category}/${record.brand}/${record.soldAmount}/${record.soldQty}/${record.qty - record.soldQty}`}
          >
            <img src={EyeIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];
  

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Sales Report</h4>
            <h6>Manage your Sales Report</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-path">
                  <a
                    className={` btn ${inputfilter ? "btn-filter setclose" : "btn-filter"
                      } `}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <a className="btn btn-searchset">
                    <img src={Search} alt="img" />
                  </a>
                </div>
              </div>
              <div className="wordset">
                <ul>
                  <li>
                    <button
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="pdf"
                      className="confirm-text"
                      onClick={handlePdfDownload}
                    >
                      <img src={Pdf} alt="img" />
                    </button>
                  </li>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="excel"
                      onClick={handleExcelDownload}
                    >
                      <img src={Excel} alt="img" />
                    </a>
                  </li>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="print"
                      onClick={handlePrint}
                    >
                      <img src={Printer} alt="img" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Filter */}
            <div
              className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
              id="filter_inputs"
              style={{ display: inputfilter ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: selectedProduct === "1" ? "Choose Product" : options.find(option => option.id === selectedProduct)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedProduct = event.params.data.id;
                          setSelectedProduct(selectedProduct);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options2}
                        options={{
                          placeholder: selectedCategory === "1" ? "Choose Category" : options2.find(option => option.id === selectedCategory)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedCategory = event.params.data.id;
                          setSelectedCategory(selectedCategory);
                        }}
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options3}
                        options={{
                          placeholder: selectedSubCategory === "1" ? "Choose Sub Category" : options3.find(option => option.id === selectedSubCategory)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedSubCategory = event.params.data.id;
                          setSelectedSubCategory(selectedSubCategory);
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="col-lg col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options4}
                        options={{
                          placeholder: selectedBrand === "1" ? "Brand" : options4.find(option => option.id === selectedBrand)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedBrand = event.params.data.id;
                          setSelectedBrand(selectedBrand);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                    <div className="form-group">
                      <button className="btn btn-filters ms-auto" onClick={() => clearFilters()}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive" id="pdf-content">
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Sales;

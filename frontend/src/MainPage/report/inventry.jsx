/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  // Calendar,
  Printer,
  // search_whites,
  Search,
  OrangeImage,
  PineappleImage,
  StawberryImage,
  Product1,
  EyeIcon,
} from "../../EntryFile/imagePath";
import * as XLSX from 'xlsx';
import { pdfjs } from 'react-pdf';
import html2canvas from 'html2canvas';
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Invertry = () => {
  // const [startDate, setStartDate] = useState(new Date());
  // const [startDate1, setStartDate1] = useState(new Date());
  // const options = [
  //   { id: 1, text: "Choose Supplier", text: "Choose Product" },
  //   { id: 2, text: "Supplier", text: "Supplier" },
  // ];
  const [inputfilter, setInputfilter] = useState(false);
  
  const togglefilter = (value) => {
    setInputfilter(value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([
    {
      id: 1,
      Name: "Macbook pro",
      Sku: "PT001",
      Category: "Computer",
      Brand: "N/D",
      Price: "1500.00",
      Unit: "pc",
      Instock: 1356,
      image: Product1,
    },
    {
      id: 2,
      Name: "Orange",
      amount: 36080,
      Sku: "PT002",
      Category: "Fruits",
      Brand: "N/D",
      Price: "10.00",
      Unit: "kg",
      Instock: 131,
      image: OrangeImage,
    },
    {
      id: 3,
      Name: "Pineapple",
      Sku: "PT003",
      Category: "Fruits",
      Brand: "N/D",
      Price: "10.00",
      Unit: "kg",
      Instock: 131,
      image: PineappleImage,
    },
    {
      id: 4,
      Name: "Strawberry",
      Sku: "PT004",
      Category: "Fruits",
      Brand: "N/D",
      Price: "10.00",
      Unit: "kg",
      Instock: 100,
      image: StawberryImage,
    }
  ]);

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
    // setSelectedSubCategory("1");
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

  // const [subCategories, setSubCategories] = useState([]);
  // useEffect(() => {
  //   const fetchSubCategories = async () => {
  //     try {
  //       const response = await axios.get(`${productUrl}/sub-category-list`);
  //       const subCategoryData = response.data.subCategoryData;
  //       setSubCategories(subCategoryData);
  //     } catch (error) {
  //       console.error("Error fetching subcategories:", error);
  //     }
  //   };

  //   fetchSubCategories();
  // }, []);

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

  // const options3 = [
  //   { id: "1", text: "Choose Sub Category" },
  //   ...subCategories.map((subCategory) => ({
  //     id: subCategory.subCategoryName,
  //     text: subCategory.subCategoryName,
  //   })),
  // ];

  const options4 = [
    { id: "1", text: "Brand" },
    ...brands.map((brand) => ({
      id: brand.brandName,
      text: brand.brandName,
    })),
  ];

  const [selectedProduct, setSelectedProduct] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("1");
  // const [selectedSubCategory, setSelectedSubCategory] = useState("1");
  const [selectedBrand, setSelectedBrand] = useState("1");

  useEffect(() => {
    const inventoryReport = async () => {
      try {
        await axios.get(`${productUrl}`).then((response) => {
          const datas = response.data
          setData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    inventoryReport()
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
      pdf.save('invoice_report.pdf');
    });
  };

  const handleExcelDownload = () => {
    // Sample data (replace this with your actual data)
    const datas = [
      ['Product Name', 'SKU', 'Category', 'Brand', 'Price', 'Unit', 'Instock QTY'],
      ...data.map((item) => [
        item.productName,
        item.sku,
        item.category,
        item.brand,
        item.price,
        item.unit,
        item.qty
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'inventary_report.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedProduct && selectedProduct !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.productName === selectedProduct
      );
    }

    if (selectedCategory && selectedCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
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
  }, [data, selectedProduct, selectedCategory, selectedBrand]);


  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img src={record.image} alt="product" />
          </Link>
          <Link to="#">{text}</Link>
        </div>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
      key: 'productName'
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
      key: 'sku'
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
      key: 'category'
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
      key: 'brand'
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      key: 'price'
    },
    {
      title: "Unit",
      dataIndex: "unit",
      sorter: (a, b) => a.unit.length - b.unit.length,
      key: 'unit'
    },
    {
      title: "Instock QTY",
      dataIndex: "qty",
      sorter: (a, b) => a.qty - b.qty,
      key: 'qty'
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/product/product-details/${record._id}`}
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
            <h4>Inventory Report</h4>
            <h6>Manage your Inventory Report</h6>
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
                  {/* <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate1}
                          onChange={(date) => setStartDate1(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: "Choose Suppliers",
                        }}
                      />
                    </div>
                  </div> */}
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
            <div id="pdf-content" className="table-responsive">
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

export default Invertry;

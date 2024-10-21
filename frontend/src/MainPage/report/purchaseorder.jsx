/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
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
import { productUrl, purchaseUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Purchaseorder = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [productData, setProductData] = useState([])
  const history = useHistory()

  const options = [
    { id: "1", text: "Choose Product" },
    ...productData.map((product) => ({ id: product.productName, text: product.productName })),
  ];
  const [inputfilter, setInputfilter] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState("1");
  const [grandTotalFilter, setGrandTotalFilter] = useState("");

  const togglefilter = (value) => {
    setInputfilter(value);
  };
  const [data, setData] = useState([
    {
      id: 1,
      Name: "Macbook pro",
      amount: 38698,
      Purchased: 1248,
      Instock: 1356,
      image: Product1,
    },
    {
      id: 2,
      Name: "Orange",
      amount: 36080,
      Purchased: 110,
      Instock: 131,
      image: OrangeImage,
    },
    {
      id: 3,
      Name: "Pineapple",
      amount: 21000,
      Purchased: 106,
      Instock: 131,
      image: PineappleImage,
    },
    {
      id: 4,
      Name: "Strawberry",
      amount: 11000,
      Purchased: 105,
      Instock: 100,
      image: StawberryImage,
    },
  ]);

  const clearFilters = () => {
    setSelectedProducts("1");
    setGrandTotalFilter("");
  };

  useEffect(() => {
    const purchaseOrderList = async () => {
      try {
        await axios.get(`${purchaseUrl}/get-purchase-order-list`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    }
    purchaseOrderList()
  }, [])

  const handleSearch = (data) => {
    setFilteredData(data);
  };

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

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedProducts && selectedProducts !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.productName === selectedProducts
      );
    }

    if (grandTotalFilter) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.totalPrice &&
          product.totalPrice.toString().includes(grandTotalFilter)
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedProducts, grandTotalFilter]);


  const columns = [
    {
      title: "Product Name",
      dataIndex: "Name",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img src={record.image} alt="product" />
          </Link>
          <Link to="#">{record.productName}</Link>
        </div>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
      key: "productName"
    },
    {
      title: "Purchased amount",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      key: "totalPrice"
    },
    {
      title: "Purchased QTY",
      dataIndex: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
      key: "totalQuantity"
    },
    {
      title: "Instock QTY",
      dataIndex: "qty",
      sorter: (a, b) => a.qty - b.qty,
      key: "qty"
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/report/details/${record.productName}/${record.totalQuantity}/${record.totalPrice}/${record.qty}`}
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
            <h4>Purchase order report</h4>
            <h6>Manage your Purchase order report</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <Tabletop data={data} onFilter={handleSearch} inputfilter={inputfilter} togglefilter={togglefilter} />
            {/* /Filter */}
            <div
              className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
              id="filter_inputs"
              style={{ display: inputfilter ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: selectedProducts === "1" ? "Choose Product" : options.find(option => option.id === selectedProducts)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedProducts = event.params.data.id;
                          setSelectedProducts(selectedProducts);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Grand Total"
                        value={grandTotalFilter}
                        onChange={(e) => setGrandTotalFilter(e.target.value)}
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

export default Purchaseorder;

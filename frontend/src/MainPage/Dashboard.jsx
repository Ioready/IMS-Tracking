/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AvocatImage,
  Dash1,
  Dash2,
  Dash3,
  Dash4,
  Dropdown,
  OrangeImage,
  PineappleImage,
  EarpodIcon,
  StawberryImage,
  IphoneIcon,
  SamsungIcon,
  MacbookIcon,
} from "../EntryFile/imagePath";
import Table from "../EntryFile/datatables"
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Doughnut, Line, PolarArea } from 'react-chartjs-2'
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { Helmet } from "react-helmet";
import RightSideBar from "../components/rightSidebar";
import axios from "axios";
import { mainUrl, settingsUrl } from "../Apis/Api";
import LoadingSpinner from "../InitialPage/Sidebar/LoadingSpinner";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {

  const history = useHistory()
  const data1 = [
    {
        "label": "ads",
        "value": 200
    },
    {
        "label": "subscription",
        "value": 100
    },
    {
        "label": "sponsership",
        "value": 150
    },
    {
        "label": "brand",
        "value": 175
    },
]

  const spinner = LoadingSpinner()

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2024)
  const [expiredData, setExpiredData] = useState([
    {
      id: 1,
      code: "IT001",
      image: OrangeImage,
      productName: "Orange",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "12-12-2022",
    },
    {
      id: 2,
      code: "IT002",
      image: PineappleImage,
      productName: "Pineapple",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "10-12-2022",
    },
    {
      id: 3,
      code: "IT003",
      image: StawberryImage,
      productName: "Stawberry",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "27-06-2022",
    },
    {
      id: 4,
      code: "IT004",
      image: AvocatImage,
      productName: "Avocat",
      brandName: "N/D",
      categoryName: "Fruits",
      expiryDate: "20-05-2022",
    },
  ]);

  // const [sortedInfo, setSortedInfo] = useState({});

  // const handleChange = (pagination, filters, sorter) => {
  //   setSortedInfo(sorter);
  // };


  const [donutChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Total Sales", "Total Sales Due", "Total Purchase"],
  });

  const [donutChartSeries, setDonutChartSeries] = useState([]);

  useEffect(() => {
    // Update donutChartSeries when data is fetched
    if (
      data.totalPurchaseAmount !== undefined &&
      data.totalSalesAmount !== undefined &&
      data.totalSalesDueAmount !== undefined
    ) {
      setDonutChartSeries([

        data.totalSalesAmount,
        data.totalSalesDueAmount,
        data.totalPurchaseAmount,
      ]);
    }
  }, [data.totalPurchaseAmount, data.totalSalesAmount, data.totalSalesDueAmount]);

  // Default value for donutChartSeries until data is fetched
  useEffect(() => {
    if (
      data.totalPurchaseAmount === undefined ||
      data.totalSalesAmount === undefined ||
      data.totalSalesDueAmount === undefined
    ) {
      setDonutChartSeries([44, 55, 0, 0, 0]); // Or any other default value you prefer
    }
  }, []);



  const [recentData, setRecentData] = useState([]);
  const years = [2024, 2023, 2022];

  console.log('data: ', data);

  useEffect(() => {
    const settings = async () => {
      try {
        setLoading(true)
        await axios.post(`${mainUrl}/dashboard`, { selectedYear }).then((response) => {
          const datas = response.data
          console.log('data: ', datas);
          setData(datas)
          setRecentData(datas.recentlyAddedProducts)
          setExpiredData(datas.fetchExpiredProducts)
        })
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    settings()
  }, [selectedYear])

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const expiredProductColumns = [
    {
      title: "SNo",
      dataIndex: "id",
      render: (text, record, index) => (
        <Link to="#" style={{ fontSize: "14px" }}>
          {index + 1}
        </Link>
      ),
      // sorter: (a, b) => a.id - b.id,
      key: "id",
    },
    {
      title: "Product Code",
      dataIndex: "sku",
      render: (text, record) => (
        <Link to="#" style={{ fontSize: "14px" }}>
          {text}
        </Link>
      ),
      sorter: (a, b) => a.sku.length - b.sku.length,
      key: "sku"
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "14px" }}>
            {record.productName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
      key: "productName"
    },
    {
      title: "Brand Name",
      dataIndex: "brand",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.brand.length - b.brand.length,
      key: "brand"
    },
    {
      title: "Category Name",
      dataIndex: "category",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.category.length - b.category.length,
      key: "category"
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.expiryDate);
        const dateB = parseDate(b.expiryDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: "expiryDate"
    },
  ];

  const recentDataColumns = [
    
    {
      title: "SNo",
      dataIndex: "id",
      render: (text, record, index) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            {index + 1}
          </Link>
        </div>
      ),
      // sorter: (a, b) => a.id - b.id,
      // sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
      // ellipsis: true,
      key: 'id',
    },
    {
      title: "Products",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname"
        onClick={() => viewDetails(record._id)}>
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "14px" }}>
            {record.productName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
      width: "250px",
      key: "productName"
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.price - b.price,
      key: "price"
    },
  ];

  if (loading) {
    return spinner
  }

  const viewDetails = async (id) => {
    try {
      history.push(`/dream-pos/product/product-details/${id}`);
    } catch (error) {
      console.log(error);
      history.push('/error-500');
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Dreams Pos admin template</title>
          <meta name="description" content="Dashboard page" />
        </Helmet>
        <div className="content">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash1} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {data.currencyData?.currencySymbol}
                    <span className="counters">
                      <CountUp end={data.totalPurchaseAmount} />
                    </span>
                  </h5>
                  <h6>Total Purchase</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash1">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash2} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {data.currencyData?.currencySymbol}
                    <span className="counters">
                      <CountUp end={data.totalSalesDueAmount} />
                    </span>
                  </h5>
                  <h6>Total Sales Due</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash2">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash3} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {data.currencyData?.currencySymbol}
                    <span className="counters">
                      <CountUp end={data.totalSalesAmount} />
                    </span>
                  </h5>
                  <h6>Total Sale Amount</h6> 
                  
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {data.currencyData?.currencySymbol}
                    <span className="counters">
                      <CountUp end={data.totalPayingAmount} />
                    </span>
                  </h5>
                  <h6>Total Paying Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>{data.customersTotalNumber}</h4>
                  <h5>Customers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>{data.suppliersTotalNumber}</h4>
                  <h5>Suppliers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>{data.purchaseInvoiceTotalNumber}</h4>
                  <h5>Purchase Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file-text" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>{data.salesInvoiceTotalNumber}</h4>
                  <h5>Sales Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file" />
                </div>
              </div>
            </div>
          </div>
          {/* Button trigger modal */}
          <div className="row">

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Donut Chart</div>
                </div>
                <div className="card-body">
                  <div className="chartjs-wrapper-demo" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <Doughnut
                  data={{
                      labels: ['Total Purchase', 'Total Sales', 'Total Sales Due'],
                      datasets: [
                          {
                              label: 'Amount',
                              data: [
                                  data.totalPurchaseAmount || 0,
                                  data.totalSalesAmount || 0,
                                  data.totalSalesDueAmount || 0
                              ],
                              backgroundColor: ['#7A7AFF', '#ffdd33', '#ff9b2a']
                          }
                      ]
                  }}
                  options={{
                      plugins: {
                          legend: {
                              display: true
                          }
                      }
                  }}
              />
              
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Recently Added Products</h4>
                  <div className="dropdown dropdown-action profile-action">
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="dropset"
                    >
                      {/* <FontAwesomeIcon icon={""} /> */}
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <Link
                          to="/dream-pos/product/productlist-product"
                          className="dropdown-item"
                        >
                          Product List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dream-pos/product/addproduct-product"
                          className="dropdown-item"
                        >
                          Product Add
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <Table
                      className="bg-denger"
                      columns={recentDataColumns}
                      dataSource={recentData}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-0">
            <div className="card-body">
              <h4 className="card-title">Expired Products</h4>
              <div className="table-responsive dataview">
                <Table
                  columns={expiredProductColumns}
                  dataSource={expiredData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightSideBar />
    </>
  );
};

export default Dashboard;
/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Table } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl, productUrl, purchaseUrl, settingsUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const options2 = [
  { id: "Pending", text: "Pending" },
  { id: "Received", text: "Received" },
];
// const deleteRow = () => {
//   $(document).on("click", ".delete-set", function () {
//     $(this).parent().parent().hide();
//   });
// };
const AddPurchase = () => {
  const [supplierName, setSupplierName] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [productName, setProductName] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [orderTax, setOrderTax] = useState('0.00')
  const [totalDiscount, setTotalDiscount] = useState('0.00')
  const [shipping, setShipping] = useState(0)
  const [description, setDescription] = useState('')
  const [grandTotalNumber, setGrandTotalNumber] = useState(0)
  const [status, setStatus] = useState('Pending')
  const [searchQuery, setSearchQuery] = useState(null);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true)
  const [currencyData, setCurrencyData] = useState({})
  const [data, setData] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [idToIndexMap, setIdToIndexMap] = useState({});
  const history = useHistory()

  const salesDatas = { supplierName, referenceNumber, productName, purchaseDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, data }

  let grandTotal = 0

  useEffect(() => {
    const products = async () => {
      try {
        await axios.get(`${productUrl}`).then((response) => {
          const datas = response.data
          setProductList(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    products()
  }, [])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${peopleUrl}/suppliers`).then((response) => {
          const datas = response.data.map((supplier) => ({
            id: supplier._id,
            text: supplier.supplierName
          }));
          setOptions(datas)
        })
        await axios.get(`${productUrl}`).then((response) => {
          const datas = response.data.map((product) => ({
            id: product._id,
            text: product.productName
          }));
          setOptions1(datas)
        })
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    const currencyData = async () => {
      try {
        await axios.get(`${settingsUrl}/get-currency`).then((response) => {
          const data = response.data[0]
          setCurrencyData(data)
        })
      } catch (error) {
        console.log(error);
      }
    }
    currencyData()
  }, [])

  useEffect(() => {
    if (data) {
      const newIdToIndexMap = {};
      data.forEach((item, index) => {
        newIdToIndexMap[item._id] = index;
      });
      setIdToIndexMap(newIdToIndexMap);
    }
  }, [data])

  const addPurchase = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true)

      if (!supplierName || !productName || !referenceNumber) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      const response = await axios.post(`${purchaseUrl}/add-purchase`, salesDatas);
      // setGrandTotalNumber(grandTotal)
      toast.success(response.data.message)
      history.push('/dream-pos/purchase/purchaselist-purchase');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    new RegExp(searchQuery, 'i').test(product.sku) || new RegExp(searchQuery, 'i').test(product.productName)
  );

  const handleSelectProduct = async (selectedProduct) => {
    const sku = selectedProduct.sku
    setSearchQuery('');
    try {
      await axios.post(`${productUrl}/filtered-data?sku=${sku}`).then((response) => {
        const newData = response.data
        newData.map(data => (
          grandTotal = grandTotalNumber + data.subTotal
        ))
        setGrandTotalNumber(grandTotal)
        if (data.length === 0) {
          // If the data state is empty, set it to the fetched data
          setData(newData);
        } else {
          // If the data state already has some data, append the fetched data to it
          setData(prevData => [...prevData, ...newData]);
        }
        // }
      })
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRow = (_id) => {
    const index = idToIndexMap[_id];
    const arrayDetails = data[index]
    const subTotal = arrayDetails.subTotal
    setGrandTotalNumber(grandTotalNumber - subTotal)
    data.splice(index, 1)
    $(document).on("click", ".delete-set", function () {
      $(this).parent().parent().hide();
    });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} width={30} />
          </Link>
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
    },
    {
      title: `Purchase Price(${currencyData?.currencySymbol})`,
      dataIndex: "price",
    },
    {
      title: `Discount(${currencyData?.currencySymbol})`,
      dataIndex: "discount",
    },
    {
      title: "Tax%",
      dataIndex: "tax",
    },
    {
      title: `Tax Amount(${currencyData?.currencySymbol})`,
      dataIndex: "taxAmount",
    },
    {
      title: `Unit Cost(${currencyData?.currencySymbol})`,
      dataIndex: "price",
    },
    {
      title: `Total Cost(${currencyData?.currencySymbol})`,
      dataIndex: "subTotal",
    },
    {
      render: (record) => (
        <>
          <Link className="delete-set" to="#" onClick={() => deleteRow(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Purchase Add</h4>
              <h6>Add/Update Purchase</h6>
            </div>
          </div>
          <form action="" onSubmit={addPurchase}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !supplierName ? 'error-message' : ''}`}>Supplier Name</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-10 col-10">
                          <Select2
                            className="select"
                            data={options}
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                            options={{
                              placeholder: "Suppliers",
                            }}
                          />
                          {submitClicked && !supplierName && (
                            <span className="error-message">Suppplier Name is required.</span>
                          )}
                        </div>
                        <div className="col-lg-2 col-sm-2 col-2 ps-0">
                          <div className="add-icon">
                            <Link to="#">
                              <img src={Plus} alt="img" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Purchase Date </label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={purchaseDate}
                          onChange={(date) => setPurchaseDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !productName ? 'error-message' : ''}`}>Product Name</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        options={{
                          placeholder: "Products",
                        }}
                      />
                      {submitClicked && !productName && (
                        <span className="error-message">Product Name is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !referenceNumber ? 'error' : ''}`}>
                      <label className={`${submitClicked && !referenceNumber ? 'error-message' : ''}`}>Reference No.</label>
                      <input type="text" name="reference" value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className={`${submitClicked && !referenceNumber ? 'error' : ''}`} />
                      {submitClicked && !referenceNumber && (
                        <span className="error-message">Reference Number is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className={`form-group`}>
                      <label>Product Name</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          placeholder="Please type product code and select..."
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        <div className="addonset">
                          <img src={Scanner} alt="img" />
                        </div>
                      </div>
                      {searchQuery ? (
                        <ul className="product-list">
                          {filteredProducts.map((product) => (
                            <li key={product.sku} onClick={() => handleSelectProduct(product)}>
                              {product.sku} - {product.productName}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 float-md-right">
                    <div className="total-order">
                      <ul>
                        <li>
                          <h4>Order Tax</h4>
                          <h5>{currencyData?.currencySymbol}{orderTax} (0.00%)</h5>
                        </li>
                        <li>
                          <h4>Discount </h4>
                          <h5>{currencyData?.currencySymbol}{totalDiscount}</h5>
                        </li>
                        <li>
                          <h4>Shipping</h4>
                          <h5>{currencyData?.currencySymbol}{shipping}</h5>
                        </li>
                        <li className="total">
                          <h4>Grand Total</h4>
                          <h5>{currencyData?.currencySymbol}{grandTotalNumber}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Order Tax</label>
                      <input type="text" name="discount" value={orderTax}
                        onChange={(e) => setOrderTax(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" name="discount" value={totalDiscount}
                        onChange={(e) => setTotalDiscount(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Shipping</label>
                      <input type="text" name="discount" value={shipping}
                        onChange={(e) => setShipping(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Status</label>
                      <Select2
                        className="select"
                        data={options2}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={{
                          placeholder: "Category",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" defaultValue={""} value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <Link to="/dream-pos/purchase/purchaselist-purchase" className="btn btn-cancel">Cancel</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPurchase;

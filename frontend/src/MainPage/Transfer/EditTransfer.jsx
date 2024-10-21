/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
  MinusIcon,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "antd";
import axios from "axios";
import { peopleUrl, productUrl, settingsUrl } from "../../Apis/Api";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

// const options1 = [
//   { id: 1, text: "Store 1", text: "Store 1" },
//   { id: 2, text: "Store 2", text: "Store 2" },
// ];

const options2 = [
  { id: "Pending", text: "Pending" },
  { id: "Received", text: "Received" },
];

// const deleteRow = () => {
//   $(document).on("click", ".delete-set", function () {
//     $(this).parent().parent().hide();
//   });
// };

const EditTransfer = () => {
  const Id = useParams()
  const id = Id.id
  const [count, setCount] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [options1, setOptions1] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [orderTax, setOrderTax] = useState('0.00')
  const [totalDiscount, setTotalDiscount] = useState('0.00')
  const [shipping, setShipping] = useState(0)
  const [description, setDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState(null);
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([])
  const [grandTotalNumber, setGrandTotalNumber] = useState(0)
  const [status, setStatus] = useState('Pending')
  const [currencyData, setCurrencyData] = useState({})
  const [idToIndexMap, setIdToIndexMap] = useState({});
  const [submitClicked, setSubmitClicked] = useState(false);
  const [data, setData] = useState([]);
  const [countList, setCountList] = useState({});
  const history = useHistory()

  const transferDatas = { from, to, startDate, orderTax, totalDiscount, shipping, description, grandTotalNumber, status, count, selectedProducts }

  // const [data] = useState([
  //   {
  //     id: 1,
  //     image: EarpodIcon,
  //     productName: "Apple Earpods",
  //     price: "1500.00",
  //     stock: "500.00",
  //     discount: "0.00",
  //     tax: "2000.00",
  //     totalCost: "500.00",
  //   },
  // ]);

  let grandTotal = 0
  let orderPercentage = 0

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
        await axios.get(`${peopleUrl}/store-list`).then((response) => {
          const datas = response.data.map((store) => ({
            id: store._id,
            text: store.storeName
          }));
          setOptions1(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
  }, [])

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/get-transfer-details/${id}`);
        console.log('get: ', response.data.selectedData);
        setData(response.data);
        setSelectedProducts(response.data.selectedData)
        const newData = response.data.selectedData
        newData.map(data => (
          grandTotal = grandTotal + data.subTotal
        ))
        setGrandTotalNumber(grandTotal)
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (data) {
      const fromName = data.from ? data.from._id : ''
      setFrom(fromName)
      const toName = data.to ? data.to._id : ''
      setTo(toName)
      setOrderTax(data.orderTax);
      setTotalDiscount(data.totalDiscount);
      setShipping(data.shipping);
      setStatus(data.status);
      setDescription(data.description)
      setCount(data.items)
    }
  }, [data]);

  useEffect(() => {
    if (selectedProducts) {
      const newIdToIndexMap = {};
      selectedProducts.forEach((item, index) => {
        newIdToIndexMap[item._id] = index;
      });
      setIdToIndexMap(newIdToIndexMap);
    }
  }, [selectedProducts])

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

  // useEffect(() => {
  //   const updateSubtotals = () => {
  //     const updatedData = data.map(product => ({
  //       ...product,
  //       subTotal: product.price * product.count,
  //     }));
  //     setGrandTotalNumber(updatedData.reduce((acc, cur) => acc + cur.subTotal, 0));
  //     setData(updatedData);
  //   };
  //   updateSubtotals();
  // }, [countList]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    new RegExp(searchQuery, 'i').test(product.sku) || new RegExp(searchQuery, 'i').test(product.productName)
  );

  const handleSelectProduct = async (selectedProduct) => {
    const sku = selectedProduct.sku
    setSearchQuery('');
    setCount(count + 1)
    try {
      await axios.post(`${productUrl}/filtered-data?sku=${sku}`).then((response) => {
        const newData = response.data
        console.log(newData);
        newData.map(data => (
          grandTotal = grandTotalNumber + data.subTotal
        ))
        setGrandTotalNumber(grandTotal)
        if (!selectedProducts) {
          // If the data state is empty, set it to the fetched data
          setSelectedProducts(newData);
        } else {
          // If the data state already has some data, append the fetched data to it
          setSelectedProducts(prevData => [...prevData, ...newData]);
        }
      })
    } catch (error) {
      console.log(error);
    }
  };

  const incrementCount = (index) => {
    const updatedCounts = { ...countList };
    updatedCounts[index] = (updatedCounts[index] || 0) + 1;
    setCountList(updatedCounts);

    const updatedData = [...data];
    updatedData[index].count += 1;
    setGrandTotalNumber((prevTotal) => prevTotal + updatedData[index].price);
    setData(updatedData);
  };

  const decrementCount = (index) => {
    if (countList[index] > 1) {
      const updatedCounts = { ...countList };
      updatedCounts[index] -= 1;
      setCountList(updatedCounts);

      const updatedData = [...data];
      updatedData[index].count -= 1;
      setGrandTotalNumber((prevTotal) => prevTotal - updatedData[index].price);
      setData(updatedData);
    }
  };

  const editTransfer = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true)

      if (!from || !to) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      const response = await axios.put(`${peopleUrl}/edit-transfer/${id}`, transferDatas);
      toast.success(response.data.message)
      history.push('/dream-pos/transfer/transferlist-transfer');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRow = (_id) => {
    setCount(count - 1)
    // Find index of the item in the data array
    const index = idToIndexMap[_id];
    
    // If index is not found, return
    if (index === undefined) {
      return;
    }
    
    // Calculate subtotal of the item being deleted
    const subTotal = selectedProducts[index].subTotal;
    
    // Update grand total
    setGrandTotalNumber(grandTotalNumber - subTotal);
    
    // Create a new array with item removed
    const newData = [...selectedProducts.slice(0, index), ...selectedProducts.slice(index + 1)];
    
    // Update the data state
    setSelectedProducts(newData);
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
      render: (text, record, index) => (
        <div className="input-group form-group mb-0">
          <button type="button"
            onClick={() => incrementCount(index)}
            className="scanner-set input-group-text"
          >
            <img src={Plus} alt="img" />
          </button>
          <input type="text" value={countList[index] || 1} className="calc-no" readOnly />
          <button type="button"
            onClick={() => decrementCount(index)}
            className="scanner-set input-group-text"
          >
            <img src={MinusIcon} alt="img" />
          </button>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, record) => (
        <span>{record.price}</span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "qty",
    },
    {
      title: "Discount",
      dataIndex: "discount",
    },
    {
      title: "Tax",
      dataIndex: "tax",
    },
    {
      title: `Total Cost(${currencyData?.currencySymbol})`,
      dataIndex: "subTotal",
    },
    {
      render: (record) => (
        <>
          <Link className="confirm-text" to="#" onClick={() => deleteRow(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Edit Transfer</h4>
              <h6>Transfer your stocks to one another store</h6>
            </div>
          </div>
          <form action="" onSubmit={editTransfer}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Date </label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !from ? 'error-message' : ''}`}>From</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        options={{
                          placeholder: "Choose",
                        }}
                      />
                      {submitClicked && !from && (
                        <span className="error-message">From is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !from ? 'error-message' : ''}`}>To</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        options={{
                          placeholder: "Choose",
                        }}
                      />
                      {submitClicked && !to && (
                        <span className="error-message">To is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
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
                      dataSource={selectedProducts}
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
                          <h1 hidden>{orderPercentage = parseFloat(orderTax) * 100}</h1>
                          <h5>{currencyData?.currencySymbol}{orderTax}({orderPercentage}%)</h5>
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
                          placeholder: "Choose status",
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
                    <Link to="/dream-pos/transfer/transferlist-transfer" className="btn btn-cancel">Cancel</Link>
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

export default EditTransfer;

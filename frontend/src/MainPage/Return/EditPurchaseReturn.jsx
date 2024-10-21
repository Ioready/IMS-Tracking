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
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "antd";
import axios from "axios";
import { peopleUrl, productUrl, purchaseUrl } from "../../Apis/Api";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

const EditPurchaseReturn = () => {
  const Id = useParams()
  const id = Id.id
  const [supplier, setSupplier] = useState('')
  const [quotationDate, setQuotationDate] = useState(new Date());
  const [referenceNumber, setReferenceNumber] = useState('')
  const [options, setOptions] = useState([]);
  const [orderTax, setOrderTax] = useState('0.00')
  const [discount, setDiscount] = useState('0.00')
  const [shipping, setShipping] = useState(0)
  const [description, setDescription] = useState('')
  const [grandTotalNumber, setGrandTotalNumber] = useState(0)
  const [status, setStatus] = useState('Pending')
  const [searchQuery, setSearchQuery] = useState(null);
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([])
  const [data, setData] = useState([]);
  const [idToIndexMap, setIdToIndexMap] = useState({});
  const history = useHistory()

  const salesDatas = { supplier, referenceNumber, quotationDate, orderTax, discount, shipping, description, grandTotalNumber, status, selectedProducts }

  let grandTotal = 0

  const options1 = [
    { id: "Pending", text: "Pending"},
    { id: "Orderded", text: "Orderded"},
    { id: "Received", text: "Received"},
  ];
  // const options = [
  //   { id: 1, text: "Apex Computers", text: "Apex Computers" },
  //   { id: 2, text: "Customer", text: "Customer" },
  // ];

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
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
  }, [])


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${purchaseUrl}/return/get-return-purchase-details/${id}`);
        console.log('get: ', response.data.purchase.selectedData);
        setData(response.data.purchase);
        setSelectedProducts(response.data.purchase.selectedData)
        const newData = response.data.purchase.selectedData
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
      const name = data.supplier ? data.supplier._id : ''
      setSupplier(name);
      const trimmedStartDate = data.quotationDate ? data.quotationDate.trim() : '';
      const purchaseDate = trimmedStartDate ? new Date(trimmedStartDate) : null;
      setQuotationDate(purchaseDate);
      setReferenceNumber(data.referenceNumber)
      setOrderTax(data.orderTax);
      setDiscount(data.discount);
      setShipping(data.shipping);
      // setGrandTotalNumber(data.grandTotalNumber);
      setStatus(data.status);
      setDescription(data.description)
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

  const editPurchaseReturn = async (e) => {
    console.log('Hello');
    try {
      e.preventDefault();
      await axios.put(`${purchaseUrl}/return/edit-return/${id}`, salesDatas);
      // setGrandTotalNumber(grandTotal)
      history.push('/dream-pos/return/purchasereturnlist-return');
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
        // if (newData.exist > 1) {
        //   console.log('ok');
        //   // newData.qty = newData.qty + 1
        // } else {
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
        // }
      })
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRow = (_id) => {
    console.log('_id: ', _id);
    const index = idToIndexMap[_id];
    const arrayDetails = selectedProducts[index]
    const subTotal = arrayDetails.subTotal
    setGrandTotalNumber(grandTotalNumber - subTotal)
    selectedProducts.splice(index, 1)
    $(document).on("click", ".delete-set", function () {
      $(this).parent().parent().hide();
    });
  };


  const [select, setSelect] = useState(false);
  console.log(select, "select");
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "2.4rem",
      minHeight: "fit-content",
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "2.4rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      marginBottom: "14px",
    }),
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
      title: "Net Unit Price($)",
      dataIndex: "price",
    },
    {
      title: "Stock",
      dataIndex: "qty",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "Discount($)",
      dataIndex: "discount",
    },
    {
      title: "Tax %",
      dataIndex: "tax",
    },
    {
      title: "Sub Total($)",
      dataIndex: "subTotal",
    },
    {
      render: (record) => (
        <>
          <Link to="#" className="delete-set" onClick={() => deleteRow(record._id)}>
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
              <h4>Edit Purchase Return</h4>
              <h6>Add/Update Purchase Return</h6>
            </div>
          </div>
          <form action="" onSubmit={editPurchaseReturn}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Supplier</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-10 col-10">
                          <Select2
                            className="select"
                            data={options}
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            options={{
                              placeholder: "Apex Computers",
                            }}
                          />
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
                      <label>Quotation Date </label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={quotationDate}
                          onChange={(date) => setQuotationDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Reference No.</label>
                      <input type="text" name="discount" value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          placeholder="Scan/Search Product by code and select..."
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
                          <h5>$ {orderTax} (0.00%)</h5>
                        </li>
                        <li>
                          <h4>Discount </h4>
                          <h5>${discount}</h5>
                        </li>
                        <li>
                          <h4>Shipping</h4>
                          <h5>$ {shipping}</h5>
                        </li>
                        <li className="total">
                          <h4>Grand Total</h4>
                          <h5>$ {grandTotalNumber}</h5>
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
                      <input type="text" name="discount" value={discount}
                        onChange={(e) => setDiscount(e.target.value)} />
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
                        data={options1}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={{
                          placeholder: "Select Status",
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
                    <Link to="/dream-pos/return/purchasereturnlist-return" className="btn btn-cancel">Cancel</Link>
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

export default EditPurchaseReturn;

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
import { peopleUrl, productUrl } from "../../Apis/Api";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const options2 = [
    { id: "Paid", text: "Paid" },
    { id: "Unpaid", text: "Unpaid" },
    { id: "Overdue", text: "Overdue" }
];
const deleteRow = () => {
    $(document).on("click", ".delete-set", function () {
        $(this).parent().parent().hide();
    });
};

const EditInvoice = () => {
    const Id = useParams()
    const id = Id.id
    const [startDate, setStartDate] = useState(new Date());
    const [customerName, setCustomerName] = useState('')
    const [reference, setReference] = useState('')
    const [options, setOptions] = useState([]);
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('Pending')
    const [submitClicked, setSubmitClicked] = useState(false);
    const [noReference, setNoReference] = useState(false)
    // const [orderTax, setOrderTax] = useState('0.00')
    // const [totalDiscount, setTotalDiscount] = useState('0.00')
    // const [shipping, setShipping] = useState(0)
    // const [grandTotalNumber, setGrandTotalNumber] = useState(0)
    // const [searchQuery, setSearchQuery] = useState(null);
    // const [productList, setProductList] = useState([]);
    const [data, setData] = useState({});
    const history = useHistory()

    const salesDatas = { customerName, reference, startDate, description, status }

    // let grandTotal = 0

    // useEffect(() => {
    //   const products = async () => {
    //     try {
    //       await axios.get(`${productUrl}`).then((response) => {
    //         const datas = response.data
    //         setProductList(datas)
    //       })
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   products()
    // }, [])

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await axios.get(`${peopleUrl}/get-invoice-details/${id}`);
                setData(response.data);
                // setSelectedProducts(response.data.selectedProducts)
                // const newData = response.data.selectedProducts
                // newData.map(data => (
                //   grandTotal = grandTotal + data.subTotal
                // ))
                // setGrandTotalNumber(grandTotal)
                // setLoading(false)
            } catch (error) {
                console.log(error);
                // history.push('/error-500')
            }
        };
        fetchInvoiceDetails();
    }, []);

      useEffect(() => {
        if (data) {
          const name = data.customerName ? data.customerName._id : ''
          setCustomerName(name);
          const trimmedStartDate = data.dueDate ? data.dueDate.trim() : '';
          const editStartDate = trimmedStartDate ? new Date(trimmedStartDate) : null;
          setStartDate(editStartDate);
          setReference(data.invoice_number)
        //   setOrderTax(data.orderTax);
        //   setTotalDiscount(data.totalDiscount);
        //   setShipping(data.shipping);
          // setGrandTotalNumber(data.grandTotalNumber);
          setStatus(data.invoice_status);
          setDescription(data.description)
        }
      }, [data]);


    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            render: (text, record) => (
                <div className="productimgname">
                    <Link to="#" className="product-img">
                        <img alt="" src={record.image} width={30} />
                    </Link>
                    <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
                        {record.product}
                    </Link>
                </div>
            ),
        },
        {
            title: "Net Unit Price($)",
            dataIndex: "qty",
        },
        // {
        //   title: "Stock",
        //   dataIndex: "stock",
        // },
        {
            title: "Qty",
            dataIndex: "qty",
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
            render: () => (
                <>
                    <Link to="#" className="delete-set" onClick={deleteRow}>
                        <img src={DeleteIcon} alt="img" />
                    </Link>
                </>
            ),
        },
    ];

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                await axios.get(`${peopleUrl}`).then((response) => {
                    const datas = response.data.map((customer) => ({
                        id: customer._id,
                        text: customer.customerName
                    }));
                    setOptions(datas)
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchOptions()
    }, [])

    const editInvoice = async (e) => {
        try {
            e.preventDefault();
            setSubmitClicked(true)

            if (!customerName || !reference || noReference) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }
            const response = await axios.put(`${peopleUrl}/edit-invoice/${id}`, salesDatas);
            console.log('res: ', response);
            if (!response.data) {
                setNoReference(true)
            } else {
                toast.success(response.data.message);
                history.push('/dream-pos/report/invoicereport');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const handleSearch = (e) => {
    //   setSearchQuery(e.target.value);
    // };

    // const filteredProducts = productList.filter((product) =>
    //   new RegExp(searchQuery, 'i').test(product.sku) || new RegExp(searchQuery, 'i').test(product.productName)
    // );

    // const handleSelectProduct = async (selectedProduct) => {
    //   const sku = selectedProduct.sku
    //   setSearchQuery('');
    //   try {
    //     await axios.post(`${productUrl}/filtered-data?sku=${sku}`).then((response) => {
    //       const newData = response.data
    //       newData.map(data => (
    //         grandTotal = grandTotalNumber + data.subTotal
    //       ))
    //       setGrandTotalNumber(grandTotal)
    //       if (data.length === 0) {
    //         // If the data state is empty, set it to the fetched data
    //         setData(newData);
    //       } else {
    //         // If the data state already has some data, append the fetched data to it
    //         setData(prevData => [...prevData, ...newData]);
    //       }
    //     })
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };


    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Edit Invoice</h4>
                            <h6>Edit/Update Invoice</h6>
                        </div>
                    </div>
                    <form action="" onSubmit={editInvoice}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label className={`${submitClicked && !customerName ? 'error-message' : ''}`}>Customer</label>
                                            <div className="row">
                                                <div className="col-lg-10 col-sm-10 col-10">
                                                    <Select2
                                                        className="select"
                                                        data={options}
                                                        value={customerName}
                                                        onChange={(e) => setCustomerName(e.target.value)}
                                                        options={{
                                                            placeholder: "Choose",
                                                        }}
                                                    />
                                                    {submitClicked && !customerName && (
                                                        <span className="error-message">Customer Name is required.</span>
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
                                            <label>Due Date </label>
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
                                        <div className={`form-group ${submitClicked && !noReference && !reference ? 'error' : ''}`}>
                                            <label className={`${submitClicked && !noReference && !reference ? 'error-message' : ''}`}>Reference No.</label>
                                            <input type="text" name="reference" value={reference}
                                                onChange={(e) => setReference(e.target.value)}
                                                className={`${submitClicked && !noReference && !reference ? 'error' : ''}`} />
                                            {submitClicked && !reference && (
                                                <span className="error-message">Reference Number is required.</span>
                                            )}
                                            {submitClicked && !noReference && (
                                                <span className="error-message">Please Check the reference</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Payment Status</label>
                                            <Select2
                                                className="select"
                                                data={options2}
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                options={{
                                                    placeholder: "Select Category",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-12 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !searchQuery ? 'error' : ''}`}>
                      <label className={`${submitClicked && !searchQuery ? 'error-message' : ''}`}>Product Name</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          placeholder="Please type product code and select..."
                          value={searchQuery}
                          onChange={handleSearch}
                          className={`${submitClicked && !searchQuery ? 'error' : ''}`}
                        />
                        {submitClicked && !searchQuery && (
                          <span className="error-message">Product Name is required.</span>
                        )}
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
                  </div> */}
                                </div>
                                {/* <div className="row">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div> */}
                                {/* <div className="row">
                  <div className="col-lg-12 float-md-right">
                    <div className="total-order">
                      <ul>
                        <li>
                          <h4>Order Tax</h4>
                          <h5>$ {orderTax}(0.00%)</h5>
                        </li>
                        <li>
                          <h4>Discount </h4>
                          <h5>$ {totalDiscount}</h5>
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
                </div> */}
                                <div className="row">
                                    {/* <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Order Tax</label>
                      <input type="text" name="orderTax" value={orderTax}
                        onChange={(e) => setOrderTax(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" name="totalDiscount" value={totalDiscount}
                        onChange={(e) => setTotalDiscount(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Shipping</label>
                      <input type="text" name="shipping" value={shipping}
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
                  </div> */}
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea className="form-control" defaultValue={""} value={description}
                                                onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <button type="submit" className="btn btn-submit me-2">Submit</button>
                                        <Link to='/dream-pos/quotation/quotationlist-quotation' className="btn btn-cancel">Cancel</Link>
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

export default EditInvoice;

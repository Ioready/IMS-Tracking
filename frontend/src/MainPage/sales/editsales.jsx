/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Scanner,
  DeleteIcon,
  Calendar,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl, productUrl } from "../../Apis/Api";
import { toast } from "react-toastify";
const Editsales = () => {
  const Id = useParams()
  const id = Id.id
  const [customerName, setCustomerName] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [supplierName, setSupplierName] = useState('')
  const [orderTax, setOrderTax] = useState('0.00')
  const [totalDiscount, setTotalDiscount] = useState('0.00')
  const [shipping, setShipping] = useState(0)
  const [grandTotalNumber, setGrandTotalNumber] = useState(0)
  const [status, setStatus] = useState('Pending')
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [data, setData] = useState([])
  const [currencyData, setCurrencyData] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const salesDatas = { customerName, startDate, supplierName, orderTax, totalDiscount, shipping, grandTotalNumber, status, selectedProducts }

  const editSale = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`${peopleUrl}/edit-sale/${id}`, salesDatas);
      if (response.data.success) {
        setGrandTotalNumber(grandTotal)
        toast.success(response.data.message);
        history.push('/dream-pos/sales/saleslist');
      }
    } catch (error) {
      console.log(error);
    }
  };

  let discount = 0
  let taxAmount = 0
  let orderPercentage = 0
  let subTotal = 0
  let grandTotal = 0
  let totalDiscountFloat = 0
  let orderTaxFloat = 0

  const options2 = [
    { id: "Completed", text: "Completed" },
    { id: "Inprogress", text: "Inprogress" },
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/get-sale-details/${id}`);
        setData(response.data);
        setSelectedProducts(response.data.selectedProducts)
      } catch (error) {
        console.log(error);
        history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (data) {
      const name = data.customerName ? data.customerName._id : ''
      setCustomerName(name);
      const trimmedStartDate = data.startDate ? data.startDate.trim() : '';
      const editStartDate = trimmedStartDate ? new Date(trimmedStartDate) : null;
      setStartDate(editStartDate);
      const sup_name = data.supplierName ? data.supplierName._id : ''
      setSupplierName(sup_name);
      setOrderTax(data.orderTax);
      setTotalDiscount(data.totalDiscount);
      setShipping(data.shipping);
      setGrandTotalNumber(data.grandTotalNumber);
      setStatus(data.status);
    }
  }, [data]);

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
        await axios.get(`${peopleUrl}`).then((response) => {
          const datas = response.data.map((customer) => ({
            id: customer._id,
            text: customer.customerName
          }));
          setOptions(datas)
        })
        await axios.get(`${peopleUrl}/suppliers`).then((response) => {
          const datas = response.data.map((supplier) => ({
            id: supplier._id,
            text: supplier.supplierName
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
    $(document).on("click", ".delete-set", function () {
      $(this).parent().parent().hide();
    });
  });

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
        if (data.length === 0) {
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

  const deleteProduct = (index) => {
    data.splice(index, 1)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Sale</h4>
            <h6>Edit your new sale</h6>
          </div>
        </div>
        <form action="" onSubmit={editSale}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Customer</label>
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
                      </div>
                      <div className="col-lg-2 col-sm-2 col-2 ps-0">
                        <div className="add-icon">
                          <span>
                            <img src={Plus} alt="img" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Customer</label>
                    <div className="input-groupicon">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                      <Link to="#" className="addonset">
                        <img src={Calendar} alt="img" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Supplier</label>
                    <Select2
                      className="select"
                      data={options1}
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      options={{
                        placeholder: "Choose",
                      }}
                    />
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
                <div className="table-responsive mb-3">
                  <table className="table">
                    <thead>
                      {selectedProducts.length !== 0 ? (
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>QTY</th>
                          <th>Price</th>
                          <th>Discount</th>
                          <th>Tax</th>
                          <th>Subtotal</th>
                          <th />
                        </tr>
                      ) : (
                        <div></div>
                      )}
                    </thead>
                    <tbody>
                      {selectedProducts.map((product, index) => (
                        <tr key={index}>
                          <td>1</td>
                          <td className="productimgname">
                            <Link to="#" className="product-img">
                              <img src={product.image} alt="product" />
                            </Link>
                            <Link to="#">{product.productName}</Link>
                          </td>
                          <td>{product.quantity}</td>
                          <td>{product.price}</td>
                          <td>{product.discount}</td>
                          <td>{product.tax}</td>
                          <h1 hidden>{discount = parseFloat(product.discount)}</h1>
                          <h1 hidden>{taxAmount = parseFloat(product.tax)}</h1>
                          <h1 hidden>{subTotal = (product.quantity * product.price) - discount + ((product.quantity * product.price) * taxAmount) / 100}</h1>
                          <td>{subTotal}</td>
                          <h1 hidden>{grandTotal = grandTotal + subTotal}</h1>
                          <td>
                            <Link to="#" onClick={() => deleteProduct(index)} className="delete-set">
                              <img src={DeleteIcon} alt="svg" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Order Tax</label>
                    <input type="text" name="orderTax" value={orderTax}
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
                        placeholder: "Choose Status",
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>
                        <li>
                          <h4>Order Tax</h4>
                          <h1 hidden>{orderPercentage = parseFloat(orderTax) * 100}</h1>
                          <h5>{currencyData.currencySymbol}{orderTax}({orderPercentage}%)</h5>
                          <h1 hidden>{orderTaxFloat = parseFloat(orderTax)}</h1>
                        </li>
                        <li>
                          <h4>Discount </h4>
                          <h1 hidden>{totalDiscountFloat = parseFloat(totalDiscount)}</h1>
                          <h5>{currencyData.currencySymbol}{totalDiscountFloat}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>
                        <li>
                          <h4>Shipping</h4>
                          <h5>{currencyData.currencySymbol}{shipping}</h5>
                        </li>
                        <li className="total">
                          <h4>Grand Total</h4>
                          {orderTaxFloat === 0.00 || totalDiscountFloat === 0.00 ? (
                            <h5>{grandTotal}</h5>
                          ) : (
                            <>
                              <h1 hidden>{grandTotal = (orderTaxFloat * grandTotal) + shipping - totalDiscountFloat}</h1>
                              <h5>{grandTotal}</h5>
                            </>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <button type="submit" to="#" className="btn btn-submit me-2">
                    Submit
                  </button>
                  <Link to={'/dream-pos/sales/saleslist'} className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editsales;

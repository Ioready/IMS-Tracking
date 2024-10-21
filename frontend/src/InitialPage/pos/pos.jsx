/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState  } from "react";
import Header from "./posheader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import POS from "./posleft";
import Transactions from "./transactions";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";


import {
  Product34,
  wallet1,
  transcation,
  trash12,
  scan,
  Edit6,
  pause1,
  debitcard,
  cash,
  Product30,
  Product31,
  Product35,
  delete2,
  ellipise1,
  scanner1,
} from "../../EntryFile/imagePath";
import { toast } from "react-toastify";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";

const Pos = () => {
  // const history = useHistory()   
  useEffect(() => {
    $("ul.tabs li").click(function () {
      var $this = $(this);
      var $theTab = $(this).attr("id");
      console.log($theTab);
      if ($this.hasClass("active")) {
        // do nothing
      } else {
        $this
          .closest(".tabs_wrapper")
          .find("ul.tabs li, .tabs_container .tab_content")
          .removeClass("active");
        $(
          '.tabs_container .tab_content[data-tab="' +
          $theTab +
          '"], ul.tabs li[id="' +
          $theTab +
          '"]'
        ).addClass("active");
      }
    });
    $(document).on("click", ".productset", function () {
      $(this).toggleClass("active");
    });
  });
  const confirmText = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    }).then(function (t) {
      t.value &&
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
    });
  };
  const [counter, setCounter] = useState(0);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleCustomerSelect = (e) => {
    const selectedCustomerId = e.target.value;
    const customer = customerList.find(customer => customer.id === parseInt(selectedCustomerId));
    setSelectedCustomer(customer);
  };

  // const options = [
  //   { id: 1, text: "Walk-in Customer", text1: "Walk-in Customer" },
  //   { id: 2, text: "Chris Moris", text2: "Chris Moris" },
  // ];
  // const options1 = [
  //   { id: 1, text: "Product", text1: "Product" },
  //   { id: 2, text: "Barcode", text2: "Barcode" },
  // ];
  // const options2 = [
  //   { id: 1, text: "Exclusive", text1: "Exclusive" },
  //   { id: 2, text: "Inclusive", text2: "Inclusive" },
  // ];
  const options3 = [
    { id: "India", text: "India", code: "+91" },
    { id: "Australia", text: "Australia", code: "+61" },
  ];

  const [customerList,setCustomerList]=useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState("");
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const customerDatas = { customerName, email, phone, country, code, city, address }


  const addCustomer = async (e) => {
    try {
      e.preventDefault();
        const allData = { customerDatas }
        const response = await axios.post(`${peopleUrl}/add-customer`, allData);
        console.log("response",response);
         if (response.data.success) {          
          toast.success("Customer Added Successfully")
          history.push('/dream-pos/people/customerlist-people');
        }

    } catch (error) {
      toast.error("Invalid Values")
      console.log(error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const selectedOption = options3.find(option => option.id === selectedCountry);

    if (selectedOption) {
      setCountry(selectedCountry);
      setCode(selectedOption.code);
    }
  };

  useEffect(() => {
    const peoples = async () => {
      try {
        await axios.get(`${peopleUrl}`).then((response) => {
          const datas = response.data
          console.log("list",datas);
          setCustomerList(datas);
          // setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
        setCustomerList([]);
      }
    }
    peoples()
  }, [])


  return (
    <>
      <div className="main-wrappers">
        <Header />
        <div className="page-wrapper ms-0">
          <div className="content">
            <div className="row">
              <POS setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts}/>
              <div className="col-lg-4 col-sm-12 ">
                <div className="order-list">
                  <div className="orderid">
                    <h4>Order List</h4>
                    <h5>Transaction id : #65565</h5>
                  </div>
                  <div className="actionproducts">
                    <ul>
                      <li>
                        <Link
                          to="#"
                          className="deletebg confirm-text"
                          onClick={confirmText}
                        >
                          <img src={delete2} alt="img" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          className="dropset"
                        >
                          <img src={ellipise1} alt="img" />
                        </Link>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                          data-popper-placement="bottom-end"
                        >
                          <li>
                            <Link to="#" className="dropdown-item">
                              Action
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item">
                              Another Action
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item">
                              Something Elses
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card card-order">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <Link
                          to="#"
                          className="btn btn-adds"
                          data-bs-toggle="modal"
                          data-bs-target="#create"
                        >
                          <i className="fa fa-plus me-2" />
                          Add Customer
                        </Link>
                      </div>
                      {customerList.length>0 && (<div className="col-lg-12">
                        <div className="select-split ">
                          <div className="select-group w-100">
                            <Select2
                              className="select"
                              data={customerList.map(customer => ({ id: customer.id, text: customer.customerName }))}
                              options={{
                                placeholder: selectedCustomer ? selectedCustomer.customerName : "Walk-in Customer",
                              }}
                              onChange={handleCustomerSelect}
                            />
                          </div>
                        </div>
                      </div>)}
                      {/* <div className="col-lg-12">
                        <div className="select-split">
                          <div className="select-group w-100">
                            <Select2
                              className="select"
                              data={options1}
                              options={{
                                placeholder: "Product",
                              }}
                            />
                          </div>
                        </div>
                      </div> */}
                      <div className="col-12">
                        <div className="text-end">
                          <Link to="#" className="btn btn-scanner-set">
                            <img src={scanner1} alt="img" className="me-2" />
                            Scan bardcode
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="split-card"></div>
                  <div className="card-body pt-0">
                    <div className="totalitem">
                      <h4>Total items : {selectedProducts.length}</h4>
                      <Link to="#" onClick={() => setSelectedProducts([])}>Clear all</Link>
                    </div>
                    <div className="product-table">
                      <ul className="product-lists">
                      {selectedProducts.length && selectedProducts.map(data => (
                        <li key={data.id}>
                          <div className="productimg">
                            <div className="productimgs">
                              <img src={data.image} alt="img" />
                            </div>
                            <div className="productcontet">
                              <h4>{data.productName}</h4>
                              <div className="productlinkset">
                                <h5>{data.sku}</h5>
                              </div>
                              <div className="increment-decrement">
                                <div className="input-groups">
                                  <input
                                    onClick={() => setCounter(counter - 1)}
                                    type="button"
                                    defaultValue="-"
                                    className="button-minus dec button"
                                  />
                                  <input
                                    type="text"
                                    name="child"
                                    value={counter}
                                    className="quantity-field"
                                  />
                                  <input
                                    onClick={() => setCounter(counter + 1)}
                                    type="button"
                                    defaultValue="+"
                                    className="button-plus inc button "
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li> ) )}
                        <li>3000.00 </li>
                        <li>
                          <Link
                            to="#"
                            className="confirm-text"
                            onClick={confirmText}
                          >
                            <img src={delete2} alt="img" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="split-card"></div>
                  <div className="card-body pt-0 pb-2">
                    <div className="setvalue">
                      <ul>
                        <li>
                          <h5>Subtotal </h5>
                          <h6>55.00$</h6>
                        </li>
                        <li>
                          <h5>Tax </h5>
                          <h6>5.00$</h6>
                        </li>
                        <li className="total-value">
                          <h5>Total</h5>
                          <h6>60.00$</h6>
                        </li>
                      </ul>
                    </div>
                    <div className="setvaluecash">
                      <ul>
                        <li>
                          <Link to="#" className="paymentmethod">
                            <img src={cash} alt="img" className="me-2" />
                            Cash
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="paymentmethod">
                            <img src={debitcard} alt="img" className="me-2" />
                            Debit
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="paymentmethod">
                            <img src={scan} alt="img" className="me-2" />
                            Scan
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="btn-totallabel">
                      <h5>Checkout</h5>
                      <h6>60.00$</h6>
                    </div>
                    <div className="btn-pos">
                      <ul>
                        <li>
                          <Link to="#" className="btn">
                            <img src={pause1} alt="img" className="me-1" />
                            Hold
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="btn">
                            <img src={Edit6} alt="img" className="me-1" />
                            Quotation
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="btn">
                            <img src={trash12} alt="img" className="me-1" />
                            Void
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="btn">
                            <img src={wallet1} alt="img" className="me-1" />
                            Payment
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target="#recents"
                          >
                            <img src={transcation} alt="img" className="me-1" />{" "}
                            Transaction
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body" >
              <div className="row">
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input type="text" onChange={(e) => setCustomerName(e.target.value)}/>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text"   onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" onChange={(e) => setPhone(e.target.value)}/>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Country</label>
                    {/* <input type="text" /> */}
                    <Select2
                        className="select"
                        data={options3}
                        value={country}
                        onChange={handleCountryChange}
                        options={{
                          placeholder: "Choose Country",
                        }}
                      />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" onChange={(e) => setCity(e.target.value)}/>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" onChange={(e) => setAddress(e.target.value)}/>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <Link to="#" className="btn btn-submit me-2" onClick={addCustomer}>
                  Submit
                </Link>
                <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transactions />
    </>
  );
};

export default Pos;

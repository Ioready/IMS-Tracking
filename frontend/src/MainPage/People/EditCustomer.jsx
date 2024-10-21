/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { peopleUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const options = [
  { id: "India", text: "India", code: "+91" },
  { id: "Australia", text: "Australia", code: "+61" },
];

const EditCustomer = () => {
  const Id = useParams();
  const id = Id.id
  const [customerData, setCustomerData] = useState([])
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState("");
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [descr, setDescr] = useState('');
  const history = useHistory()
  const customerDatas = { customerName, email, phone, country, code, state, city, zipCode, address, descr }

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/edit-details/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        history.push('/error-500')
      }
    };
    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    if (customerData) {
      setCustomerName(customerData.customerName);
      setEmail(customerData.email);
      setPhone(customerData.phone);
      setCountry(customerData.country);
      setState(customerData.state)
      setCity(customerData.city);
      setZipCode(customerData.zipCode);
      setAddress(customerData.address);
      setDescr(customerData.descr);
      // Update other state variables similarly
    }
  }, [customerData]);

  const editCustomer = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`${peopleUrl}/edit-customer/${id}`, customerDatas);
      toast.success("Customer Edited Successfully")
      history.push('/dream-pos/people/customerlist-people');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const selectedOption = options.find(option => option.id === selectedCountry);
    
    if (selectedOption) {
      setCountry(selectedCountry);
      setCode(selectedOption.code);
    }
  };
  
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Edit Customer Management</h4>
              <h6>Edit/Update Customer</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={editCustomer} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <input type="text" name="customerName" value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" name="customerName" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="customerName" value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Choose Country</label>
                      <Select2
                        className="select"
                        data={options}
                        value={country}
                        onChange={handleCountryChange}
                        options={{
                          placeholder: "United States",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={state}
                        onChange={(e) => setState(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={city}
                        onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input type="text" name="zipCode" value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-9 col-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input type="text" name="address" value={address}
                        onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" name='dscr' defaultValue={""} value={descr}
                        onChange={(e) => setDescr(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Update</button>
                    <button type="button" className="btn btn-cancel">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default EditCustomer;

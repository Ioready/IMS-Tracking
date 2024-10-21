/* eslint-disable no-dupe-keys */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { settingsUrl } from "../../Apis/Api";
import { EditIcon } from "../../EntryFile/imagePath";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EmailSettings = () => {
  const [mailHost, setMailHost] = useState('')
  const [mailPort, setMailPort] = useState('')
  const [mailAddress, setMailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [mailFromName, setMailFromName] = useState('')
  const [encryption, setEncryption] = useState('')
  const [data, setData] = useState({})
  const history = useHistory()

  const emailDatas = {mailHost, mailPort, mailAddress, password, mailFromName, encryption}

  console.log('data: ', data);
  
  const options = [
    { id: "Encryption", text: "Encryption" }
  ];

  useEffect(() => {
    const settings = async () => {
      try {
        await axios.get(`${settingsUrl}/get-email-settings`).then((response) => {
          const datas = response.data
          setData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    settings()
  }, [])

  const addEmail = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${settingsUrl}/add-email-settings`, emailDatas);
      history.push('/dream-pos/settings/emailsettings');
    } catch (error) {
      console.log(error);
    }
  }


  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleEdit = () => {
    history.push('/dream-pos/settings/editemailsettings')
  }

  return (
    <div className="page-wrapper">
      {data.length === 0 ? (
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Email Setting</h4>
              <h6>Manage Email Setting</h6>
            </div>
          </div>
          {/* /add */}
          <form action="" onSubmit={addEmail}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Mail Host <span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={mailHost}
                          onChange={(e) => setMailHost(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Mail Port<span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={mailPort}
                          onChange={(e) => setMailPort(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Mail Address <span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={mailAddress}
                          onChange={(e) => setMailAddress(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Password <span className="manitory">*</span>
                    </label>
                    <div className="pass-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className=" pass-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                          }`}
                        onClick={togglePassword}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Mail From Name<span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={mailFromName}
                          onChange={(e) => setMailFromName(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Encryption <span className="manitory">*</span>
                    </label>
                    <Select2
                      className="select"
                      data={options}
                      value={encryption}
                      onChange={(e) => setEncryption(e.target.value)}
                      options={{
                        placeholder: "Choose",
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">
                      Submit
                    </button>
                    <Link to="#" className="btn btn-cancel">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
          {/* /add */}
        </div>

      ) : (
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Email Settings List</h4>
              <h6>Manage email Settings</h6>
            </div>
            <div className="page-btn">
              <button
                className="btn btn-added"
                // data-bs-toggle="modal"
                // data-bs-target="#addpayment"
                onClick={handleEdit}
              // href="/dream-pos/settings/generalsettings"
              >
                <img src={EditIcon} alt="img" className="me-2" />
                Edit Email Settings
              </button>
            </div>
          </div>
          {/* /add */}
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="content">
                  </div>
                  <div className="productdetails">
                    <ul className="product-bar">
                      <li>
                        <h4>Mail Host</h4>
                        <h6>{data.mailHost}</h6>
                      </li>
                      <li>
                        <h4>Male Port</h4>
                        <h6>{data.mailPort}</h6>
                      </li>
                      <li>
                        <h4>Male Address</h4>
                        <h6>{data.mailAddress}</h6>
                      </li>
                      <li>
                        <h4>Password</h4>
                        <h6>{data.password}</h6>
                      </li>
                      <li>
                        <h4>Mail From Name</h4>
                        <h6>{data.mailFromName}</h6>
                      </li>
                      <li>
                        <h4>Encryption</h4>
                        <h6>{data.encryption}</h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="slider-product-details">
                </div>
              </div>
            </div>
          </div> */}
          </div>
          {/* /add */}
        </div>
      )}
    </div>
  );
};

export default EmailSettings;

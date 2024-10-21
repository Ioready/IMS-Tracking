/* eslint-disable no-dupe-keys */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { settingsUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EditEmailSettings = () => {
    const [mailHost, setMailHost] = useState('')
    const [mailPort, setMailPort] = useState('')
    const [mailAddress, setMailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [mailFromName, setMailFromName] = useState('')
    const [encryption, setEncryption] = useState('')
    const [data, setData] = useState({})
    const history = useHistory()

    const emailDatas = { mailHost, mailPort, mailAddress, password, mailFromName, encryption }

    const options = [
        { id: "Encryption", text: "Encryption" },
    ];

    console.log('data: ',data);
    const id = data._id
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

    
  useEffect(() => {
    if (data) {
        setMailHost(data.mailHost);
        setMailPort(data.mailPort);
        setMailAddress(data.mailAddress)
        setPassword(data.password)
        setMailFromName(data.mailFromName)
        setEncryption(data.encryption)
    }
  }, [data]);


    const editEmail = async (e) => {
        try {
          e.preventDefault();
          await axios.put(`${settingsUrl}/edit-email-settings/${id}`, emailDatas);
          history.push('/dream-pos/settings/emailsettings');
        } catch (error) {
          console.log(error);
        }
      }
    


    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Edit Email Setting</h4>
                        <h6>Update Email Setting</h6>
                    </div>
                </div>
                {/* /add */}
                <form action="" onSubmit={editEmail}>
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
        </div>
    );
};

export default EditEmailSettings;
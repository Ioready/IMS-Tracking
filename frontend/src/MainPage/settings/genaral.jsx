/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Upload } from "../../EntryFile/imagePath";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { settingsUrl } from "../../Apis/Api";

const GenaralSettings = () => {
  const [data, setData] = useState({})
  const [title, setTitle] = useState('')
  const [timeZone, setTImeZone] = useState('')
  const [currency, setCurrency] = useState('')
  const [dateFormat, setDateFormat] = useState(new Date())
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [address, setAddress] = useState()
  const [image, setImage] = useState([])
  const id = data._id
  const history = useHistory()

  const generalSettingsDatas = { title, timeZone, currency, dateFormat, email, phone, address }

  const options = [
    { id: "IST", text: "IND Time Zone" },
    { id: "UST", text: "USD Time Zone" },
  ];
  const options1 = [
    { id: "USD", text: "USD" },
    { id: "INR", text: "INR" },
  ];
  const options2 = [
    { id: "DD/MM/YYYY", text: "DD/MM/YYYY" },
    { id: "MM/DD/YYYY", text: "MM/DD/YYYY" },
  ];

  useEffect(() => {
    const settings = async () => {
      try {
        await axios.get(`${settingsUrl}/general-settings`).then((response) => {
          const datas = response.data.settingsList[0]
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
      setTitle(data.title);
      setTImeZone(data.timeZone);
      setCurrency(data.currency);
      setDateFormat(data.dateFormat);
      setEmail(data.email);
      setPhone(data.phone);
      setAddress(data.address);
      setImage(data.image);
      // Update other state variables similarly
    }
  }, [data]);

  const editGeneral = async (e) => {
    try {
      e.preventDefault();

      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { generalSettingsDatas, image }
        await axios.put(`${settingsUrl}/general-settings/${id}`, allData);
        history.push('/dream-pos/settings/generalsettingslist');
      } else {
        const uploadImage = async (image) => {
          const data = new FormData();
          data.append('file', image);
          data.append('upload_preset', 'ioready');
          const response = await axios.post('https://api.cloudinary.com/v1_1/dnrcd8rxl/image/upload', data);
          return response.data.url;
        };

        const uploadedImageUrl = await uploadImage(image);
        console.log('Uploaded image URL: ', uploadedImageUrl);

        const allData = { generalSettingsDatas, image: uploadedImageUrl };
        console.log('All data: ', allData);

        await axios.put(`${settingsUrl}/general-settings/${id}`, allData);
        history.push('/dream-pos/settings/generalsettingslist');
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit General Setting</h4>
            <h6>Update General Setting</h6>
          </div>
        </div>
        {/* /add */}
        <form action="" onSubmit={editGeneral}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>
                      Title <span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={title}
                      onChange={(e) => setTitle(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Time Zone </label>
                    <Select2
                      className="select"
                      data={options}
                      value={timeZone}
                      onChange={(e) => setTImeZone(e.target.value)}
                      options={{
                        placeholder: "Choose Time Zone",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>
                      Currency <span className="manitory">*</span>
                    </label>
                    <Select2
                      className="select"
                      data={options1}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      options={{
                        placeholder: "Choose Currency",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>
                      Date Format<span className="manitory">*</span>
                    </label>
                    <Select2
                      className="select"
                      data={options2}
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      options={{
                        placeholder: "Choose Date Format",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>
                      Email<span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>
                      Phone<span className="manitory">*</span>
                    </label>
                    <input type="text" name="orderTax" value={phone}
                      onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="form-group">
                    <label>
                      Address<span className="manitory">*</span>{" "}
                    </label>
                    <input type="text" name="orderTax" value={address}
                      onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label> Product Image</label>
                    <div className="image-upload">
                      <input type="file" accept='image/*'
                        onChange={(e) => setImage(e.target.files[0])} />
                      <div className="image-uploads">
                        <img src={Upload} alt="img" />
                        <h4>Drag and drop a file to upload</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">
                      Submit
                    </button>
                    <Link to="/dream-pos/settings/generalsettingslist" className="btn btn-cancel">
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

export default GenaralSettings;

import React, { useState } from 'react';
import { Upload } from '../../EntryFile/imagePath';
import axios from 'axios';
import { productUrl } from '../../Apis/Api';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';

const AddBrand = () => {
    const [brandName, setBrandName] = useState('');
    const [description, setDescription] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [image, setImage] = useState([]);
    const history = useHistory()
    const productDatas = { brandName, description }

    const addBrand = async (e) => {
        console.log(image);
        try {
            e.preventDefault();
            setSubmitClicked(true)
            if (!brandName) {
                // You can display an error message, prevent the payment, or take appropriate action
                // alert('Email is required before proceeding to payment.');
                return;
            }

            // Check if an image is selected
            if (image.length === 0) {
                // Handle the case where no image is selected
                console.log('No image selected');
                const allData = { productDatas, image }
                const response = await axios.post(`${productUrl}/add-brand`, allData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    history.push('/dream-pos/product/brandlist-product');
                  }
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

                const allData = { productDatas, image: uploadedImageUrl };
                console.log('All data: ', allData);

                const response = await axios.post(`${productUrl}/add-brand`, allData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    history.push('/dream-pos/product/brandlist-product');
                  }
            }
        } catch (error) {
            console.log(error);
            toast.error('Invalid Values')
        }
    };
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Brand ADD</h4>
                            <h6>Create new Brand</h6>
                        </div>
                    </div>
                    {/* /add */}
                    <form onSubmit={addBrand} action="">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className={`form-group ${submitClicked && !brandName ? 'error' : ''}`}>
                                            <label className={`${submitClicked && !brandName ? 'error-message' : ''}`}>Brand Name</label>
                                            <input type="text" name="brandName" value={brandName}
                                                onChange={(e) => setBrandName(e.target.value)}
                                                className={`${submitClicked && !brandName ? 'error' : ''}`} />
                                            {submitClicked && !brandName && (
                                                <span className="error-message">Brand Name is required.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea className="form-control" defaultValue={""} name="description" value={description}
                                                onChange={(e) => setDescription(e.target.value)} />
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
                                    <div className="col-lg-12">
                                        <button className="btn btn-submit me-2">
                                            Submit
                                        </button>
                                        <Link to='/dream-pos/product/brandlist-product' className="btn btn-cancel">
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {/* /add */}
                </div>
            </div>

        </>
    )
}

export default AddBrand;
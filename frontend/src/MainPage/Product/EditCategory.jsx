/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Samsung, Upload } from '../../EntryFile/imagePath'
import { Link, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios';
import { productUrl } from '../../Apis/Api';
import { toast } from 'react-toastify';

const EditCategory = () => {
    const Id = useParams();
    const id = Id.id
    const history = useHistory();
    const [productData, setProductData] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState([]);

    const productDatas = { categoryName, categoryCode, description }

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${productUrl}/edit-category-details/${id}`);
                setProductData(response.data);
            } catch (error) {
                console.log(error);
                history.push('/error-500')
            }
        };
        fetchProductDetails();
    }, []);

    useEffect(() => {
        if (productData) {
            setCategoryName(productData.categoryName);
            setCategoryCode(productData.categoryCode);
            setDescription(productData.description);
            setImage(productData.image);
            // Update other state variables similarly
        }
    }, [productData]);

    const editCategory = async (e) => {
        try {
            e.preventDefault();

            // Check if an image is selected
            if (image.length === 0) {
                // Handle the case where no image is selected
                console.log('No image selected');
                const allData = { productDatas, image }
                const response = await axios.put(`${productUrl}/edit-category/${id}`, allData);
                if (response.data.success) {
                    toast.success(response.data.message);
                    history.push('/dream-pos/product/categorylist-product');
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

                await axios.put(`${productUrl}/edit-category/${id}`, allData);
                history.push('/dream-pos/product/categorylist-product');
            }

        } catch (error) {
            console.log(error);
            toast.error('Invalid Values')
        }
    };



    if (!productData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Product Edit Category</h4>
                            <h6>Edit a product Category</h6>
                        </div>
                    </div>
                    {/* /add */}
                    <form onSubmit={editCategory} action="">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Category Name</label>
                                            <input type="text" name="categoryName" value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Category Code</label>
                                            <input type="text" name="categoryCode" value={categoryCode}
                                                onChange={(e) => setCategoryCode(e.target.value)} />
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
                                    {image.length !== 0 ? (
                                        <div className="col-12">
                                            <div className="product-list">
                                                <ul className="row">
                                                    <li>
                                                        <div className="productviews">
                                                            <div className="productviewsimg">
                                                                <img src={image} alt="img" />
                                                            </div>
                                                            <div className="productviewscontent">
                                                                <div className="productviewsname">
                                                                    <h2>{categoryName}</h2>
                                                                    <h3>581kb</h3>
                                                                </div>
                                                                <a onClick={(e) => setImage([])} className="hideset">
                                                                    x
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="col-lg-12">
                                        <button className="btn btn-submit me-2">
                                            Submit
                                        </button>
                                        <Link to='/dream-pos/product/categorylist-product' className="btn btn-cancel">
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

export default EditCategory
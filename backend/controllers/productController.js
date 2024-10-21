// import csvtojson from 'csvtojson';
import csvParser from 'csv-parser'
import fs from 'fs';
import brandModel from "../models/products/brandModel.js";
import categoryModel from "../models/products/categoryModel.js";
import productModel from "../models/products/productModel.js";
import subCategoryModel from "../models/products/subCategoryModel.js";
import userModel from '../models/peoples/userModel.js';
import wareHouseModel from '../models/products/wareHouseModel.js';


export const getProducts = async (req, res) => {
    // let index = 0
    try {
        const products = await productModel.find()
            .populate({
                path: 'category',
                select: 'categoryName -_id' // Exclude _id from the populated field
            })
            .populate({
                path: 'subCategory',
                select: 'subCategoryName -_id' // Exclude _id from the populated field
            })
            .populate({
                path: 'brand',
                select: 'brandName -_id' // Exclude _id from the populated field
            });

        const productData = products.map((product,index) => ({
            ...product._doc,
            category: product.category ? product.category.categoryName : null,
            subCategory: product.subCategory ? product.subCategory.subCategoryName : null,
            brand: product.brand ? product.brand.brandName : null,
            key: product.key ? product.key : product._id
            // taxAmount: product.taxAmount ? product.taxAmount : parseInt(product.tax) / 100
        }));
        console.log('pro: ', productData);
        res.status(200).send(productData);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const addProducts = async (req, res) => {
    try {
        const { productDatas, image } = req.body
        const userId = req.body.userId
        const user = await userModel.findById(userId)
        const userName = user.userName
        const { productName, category, subCategory, brand, wareHouse, unit, sku, expiryDate, qty, descr, tax, discount, price, status } = productDatas
        const taxAmount = parseInt(tax) * price / 100
        const productData = new productModel({
            productName, category, subCategory, brand, wareHouse, unit, sku, expiryDate, qty, descr, tax, taxAmount, discount, price, status, image,
            createdBy: userName
        })
        productData.save()
        res.status(200).send({ success: true, message: 'Product added successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id)
            .populate({
                path: 'category',
                select: '_id' // Include _id from the populated field
            })
            .populate({
                path: 'subCategory',
                select: '_id' // Include _id from the populated field
            })
            .populate({
                path: 'brand',
                select: '_id' // Include _id from the populated field
            })

        if (!product) {
            return res.status(404).send({ message: "Product not found", success: false });
        }

        const modifiedProduct = {
            ...product.toObject(),
            category: product.category._id,
            subCategory: product.subCategory._id,
            brand: product.brand._id
        };

        console.log('modifiedProduct: ', modifiedProduct);
        res.status(200).send(modifiedProduct);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}


export const editProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { productDatas, image } = req.body
        const { productName, category, subCategory, brand, unit, sku, expiryDate, qty, descr, tax, discount, price, status } = productDatas
        const taxAmount = parseInt(tax) * price / 100
        await productModel.findByIdAndUpdate(id, {
            $set: {
                productName, category, subCategory, brand, unit, sku, expiryDate, qty, descr, tax, taxAmount, discount, price, status, image, dateAdded: new Date()
            }
        })
        res.status(200).send({ success: true, message: 'Product updated successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const getDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id)
            .populate({
                path: 'category',
                select: 'categoryName -_id' // Exclude _id from the populated field
            })
            .populate({
                path: 'subCategory',
                select: 'subCategoryName -_id' // Exclude _id from the populated field
            })
            .populate({
                path: 'brand',
                select: 'brandName -_id' // Exclude _id from the populated field
            });

        if (!product) {
            return res.status(404).send({ message: "Product not found", success: false });
        }

        const productData = {
            ...product._doc,
            category: product.category ? product.category.categoryName : null,
            subCategory: product.subCategory ? product.subCategory.subCategoryName : null,
            brand: product.brand ? product.brand.brandName : null
        };
        res.status(200).send(productData);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}

export const getCategory = async (req, res) => {
    try {
        const categoryData = await categoryModel.find()
        res.status(200).send({ categoryData })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in category", success: false, error })
    }
}

export const addCategory = async (req, res) => {
    try {
        const { productDatas, image } = req.body
        const { categoryName, categoryCode, description } = productDatas
        const userId = req.body.userId
        const user = await userModel.findById(userId)
        const userName = user.userName
        console.log(userName);
        const categoryData = new categoryModel({
            categoryName, categoryCode, description, image, createdBy: userName
        })
        categoryData.save()
        res.status(200).send({ success: true,  message: 'Category added successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editCategoryDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id)
        if (!category) {
            return res.status(404).send({ message: "Product not found", success: false });
        }
        res.status(200).send(category);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}

export const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const { productDatas, image } = req.body
        const { categoryName, categoryCode, description } = productDatas
        await categoryModel.findByIdAndUpdate(id, {
            $set: {
                categoryName, categoryCode, description, image
            }
        })
        res.status(200).send({ success: true, message: 'Category updated successful'  })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in Category", success: false, error })
    }
}

export const getSubCategory = async (req, res) => {
    try {
        const allData = await subCategoryModel.find().populate({
            path: 'parentCategory',
            select: 'categoryName'
        });

        // Iterate over each object in allData to include parentCategory and remove existing parentCategory field
        const subCategoryData = allData.map(data => ({
            ...data._doc,
            parentCategory: data.parentCategory ? data.parentCategory.categoryName : null
        }));
        res.status(200).send({ subCategoryData });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in brands", success: false, error })
    }
}

export const addSubCategory = async (req, res) => {
    try {
        const {userId, subCategoryName, parentCategory, subCategoryCode, description } = req.body
        const user = await userModel.findById(userId)
        const userName = user.userName
        const subCategoryData = new subCategoryModel({
            subCategoryName, parentCategory, subCategoryCode, description, createdBy: userName
        })
        subCategoryData.save()
        res.status(200).send({ success: true,  message: 'Sub Category added successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editSubCategoryDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const subCategories = await subCategoryModel.findById(id)
            .populate({
                path: 'parentCategory',
                select: '_id' // Include _id from the populated field
            })

        if (!subCategories) {
            return res.status(404).send({ message: "Product not found", success: false });
        }

        const modifiedSubCategory = {
            ...subCategories.toObject(),
            parentCategory: subCategories.parentCategory._id
        };

        res.status(200).send(modifiedSubCategory);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}

export const editSubCategory = async (req, res) => {
    try {
        const id = req.params.id
        const { subCategoryName, parentCategory, subCategoryCode, description } = req.body
        await subCategoryModel.findByIdAndUpdate(id, {
            $set: {
                subCategoryName, parentCategory, subCategoryCode, description
            }
        })
        res.status(200).send({ success: true, message: 'Sub Category updated successful'  })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in Category", success: false, error })
    }
}

export const getBrands = async (req, res) => {
    try {
        const brandData = await brandModel.find()
        res.status(200).send({ brandData })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in brands", success: false, error })
    }
}

export const addBrand = async (req, res) => {
    try {
        const { productDatas, image } = req.body
        const { brandName, description } = productDatas
        const brandData = new brandModel({
            brandName, description, image
        })
        brandData.save()
        res.status(200).send({ success: true,  message: 'Brand added successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editBrandDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const brands = await brandModel.findById(id)
        if (!brands) {
            return res.status(404).send({ message: "Product not found", success: false });
        }
        res.status(200).send(brands);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}

export const editBrand = async (req, res) => {
    try {
        const id = req.params.id
        const { productDatas, image } = req.body
        const { brandName, description } = productDatas
        await brandModel.findByIdAndUpdate(id, {
            $set: {
                brandName, description, image
            }
        })
        res.status(200).send({ success: true, message: 'Brand updated successful'  })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in Category", success: false, error })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        await productModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        await categoryModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const deleteBrand = async (req, res) => {
    try {
        const id = req.params.id
        await brandModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id
        await subCategoryModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const getWareHouse = async (req, res) => {
    try {
        const wareHouseData = await wareHouseModel.find()
        res.status(200).send({ wareHouseData })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in category", success: false, error })
    }
}

export const editWareHouseDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const wareHouse = await wareHouseModel.findById(id)
        if (!wareHouse) {
            return res.status(404).send({ message: "Product not found", success: false });
        }
        res.status(200).send(wareHouse);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in fetching product details", success: false, error });
    }
}

export const addWareHouse = async (req, res) => {
    try {
        const { productDatas, image } = req.body
        const { wareHouseName, wareHouseCode, description } = productDatas
        const userId = req.body.userId
        const user = await userModel.findById(userId)
        const userName = user.userName
        console.log(userName);
        const wareHouseData = new wareHouseModel({
            wareHouseName, wareHouseCode, description, image, createdBy: userName
        })
        wareHouseData.save()
        res.status(200).send({ success: true,  message: 'Ware House added successful' })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const editWareHouse = async (req, res) => {
    try {
        const id = req.params.id
        const { productDatas, image } = req.body
        const { wareHouseName, wareHouseCode, description } = productDatas
        await wareHouseModel.findByIdAndUpdate(id, {
            $set: {
                wareHouseName, wareHouseCode, description, image
            }
        })
        res.status(200).send({ success: true, message: 'Ware House updated successful'  })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in Category", success: false, error })
    }
}

export const deleteWareHouse = async (req, res) => {
    try {
        const id = req.params.id
        await wareHouseModel.deleteOne({ _id: id })
        res.status(200).send({ delete: true })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const getFilteredData = async (req, res) => {
    try {
        const sku = req.query.sku
        const product = await productModel.findOne({ sku: sku })
        const subTotal = (product.quantity * product.price) - parseFloat(product.discount) + ((product.quantity * product.price) * parseFloat(product.tax)) / 100
        await productModel.findOneAndUpdate({ sku: sku }, {
            $set: {
                subTotal,
                exist: true
            }
        })
        const updatedProduct = await productModel.findOne({ sku: sku })
        const products = [updatedProduct]
        res.status(200).send(products)
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ message: "Error in products", success: false, error })
    }
}

export const importProduct = async (req, res) => {
    console.log(req.body.file);
    try {
        // Check if a file was uploaded
        if (!req.files) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Access the uploaded file
        const uploadedFile = req.files.file; // Assuming the file key is 'file'
        console.log(uploadedFile);

        // Prepare a readable stream from the uploaded file
        const csvReadStream = fs.createReadStream(uploadedFile.path);

        // Parse the CSV file
        const csvData = [];
        csvReadStream
            .pipe(csvParser())
            .on('data', (row) => {
                // Process each row and store it in an array
                csvData.push(row);
            })
            .on('end', async () => {
                // Save the CSV data to the database (modify for your logic)
                // ... your database saving logic using csvData ...

                // Respond with success message
                res.status(200).json({ success: true, message: 'CSV file uploaded and data stored successfully' });
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                res.status(500).json({ success: false, message: 'Error reading CSV file', error });
            });
    } catch (error) {
        console.error('Error uploading CSV file:', error);
        res.status(500).json({ success: false, message: 'Error uploading CSV file', error });
    }
};

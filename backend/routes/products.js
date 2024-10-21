import express from 'express'
import { addBrand, addCategory, addProducts, addSubCategory, addWareHouse, deleteBrand, deleteCategory, deleteProduct, deleteSubCategory, deleteWareHouse, editBrand, editBrandDetails, editCategory, editCategoryDetails, editDetails, editProduct, editSubCategory, editSubCategoryDetails, editWareHouse, editWareHouseDetails, getBrands, getCategory, getDetails, getFilteredData, getProducts, getSubCategory, getWareHouse, importProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import userAuth from '../middleware/userAuth.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/view-details/:id', getDetails)
router.get('/edit-details/:id', editDetails)
router.get('/edit-category-details/:id', editCategoryDetails)
router.get('/edit-brand-details/:id', editBrandDetails)
router.get('/edit-sub-category-details/:id', editSubCategoryDetails)
router.get('/category-list', getCategory)
router.get('/sub-category-list', getSubCategory)
router.get('/brand-list', getBrands)
router.get('/ware-house-list', getWareHouse)
router.get('/edit-ware-house-details/:id', editWareHouseDetails)

router.post('/add-product',userAuth, addProducts)
router.post('/add-category',userAuth, addCategory)
router.post('/add-sub-category',userAuth, addSubCategory)
router.post('/add-brand', addBrand)
router.post('/add-ware-house',userAuth, addWareHouse)
router.post('/filtered-data', getFilteredData)
router.post('/import-product',upload.single('file'), importProduct)

router.put('/edit-product/:id', editProduct)
router.put('/edit-category/:id', editCategory)
router.put('/edit-brand/:id', editBrand)
router.put('/edit-ware-house/:id', editWareHouse)
router.put('/edit-sub-category/:id', editSubCategory)

router.delete('/delete-product/:id', deleteProduct)
router.delete('/delete-category/:id', deleteCategory)
router.delete('/delete-brand/:id', deleteBrand)
router.delete('/delete-sub-category/:id', deleteSubCategory)
router.delete('/delete-ware-house/:id', deleteWareHouse)


export default router
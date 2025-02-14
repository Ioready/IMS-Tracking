/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route ,Switch} from 'react-router-dom';
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import CategoryList from './CategoryList';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import SubCategoryTable from './SubCategoryTable';
import AddSubCategory from './AddSubCategory';
import EditSubCategory from './EditSubCategory';
import BrandList from './BrandList';
import AddBrand from './AddBrand';
import EditBrand from './EditBrand';
import ImportProduct from './ImportProduct';
import PrintBarcode from './PrintBarcode';
import ProductDetails from './productDetails';
import WareHouseList from './WareHouseList';
import AddWareHouse from './AddWareHouse';
import EditWareHouse from './EditWareHouse';

const ProductRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/productlist-product`} />
        <Route path={`${match.url}/productlist-product`} component={ProductList} />
        <Route path={`${match.url}/addproduct-product`} component={AddProduct} />
        <Route path={`${match.url}/editproduct-product/:id`} component={EditProduct} />
        <Route path={`${match.url}/categorylist-product`} component={CategoryList} />
        <Route path={`${match.url}/addcategory-product`} component={AddCategory} />
        <Route path={`${match.url}/editcategory-product/:id`} component={EditCategory} />
        <Route path={`${match.url}/subcategorytable-product`} component={SubCategoryTable} />
        <Route path={`${match.url}/addsubcategory-product`} component={AddSubCategory} />
        <Route path={`${match.url}/editsubcategory-product/:id`} component={EditSubCategory} />
        <Route path={`${match.url}/brandlist-product`} component={BrandList} />
        <Route path={`${match.url}/addbrand-product`} component={AddBrand} />
        <Route path={`${match.url}/editbrand-product/:id`} component={EditBrand} />
        <Route path={`${match.url}/importproduct-product`} component={ImportProduct} />
        <Route path={`${match.url}/printbarcode-product`} component={PrintBarcode} />
        <Route path={`${match.url}/product-details/:id`} component={ProductDetails} />
        <Route path={`${match.url}/warehouselist-product`} component={WareHouseList} />
        <Route path={`${match.url}/addwarehouse-product`} component={AddWareHouse} />
        <Route path={`${match.url}/editwarehouse-product/:id`} component={EditWareHouse} />

    </Switch>
)

export default ProductRoute;
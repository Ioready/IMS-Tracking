import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { settingsUrl } from "../../Apis/Api";

const Editpermission = () => {
  const Id = useParams()
  const id = Id.id
  // const [role, setRole] = useState('')
  // const [noroleData, setNoRoleData] = useState(false);
  const [roleDescription, setRoleDescription] = useState('')
  const [selectAll, setSelectAll] = useState(false);
  const [userView, setUserView] = useState(false);
  const [userCreate, setUserCreate] = useState(false);
  const [userEdit, setUserEdit] = useState(false);
  const [userDelete, setUserDelete] = useState(false);
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [productView, setProductView] = useState(false);
  const [productCreate, setProductCreate] = useState(false);
  const [productEdit, setProductEdit] = useState(false);
  const [productDelete, setProductDelete] = useState(false);
  const [productBarcode, setProductBarcode] = useState(false);
  const [selectAllProducts, setSelectAllProducts] = useState(false);
  const [expenseView, setExpenseView] = useState(false);
  const [expenseCreate, setExpenseCreate] = useState(false);
  const [expenseEdit, setExpenseEdit] = useState(false);
  const [expenseDelete, setExpenseDelete] = useState(false);
  const [selectAllExpenses, setSelectAllExpenses] = useState(false);
  const [saleView, setSaleView] = useState(false);
  const [saleCreate, setSaleCreate] = useState(false);
  const [saleEdit, setSaleEdit] = useState(false);
  const [saleDelete, setSaleDelete] = useState(false);
  const [selectAllSales, setSelectAllSales] = useState(false);
  const [purchaseView, setPurchaseView] = useState(false);
  const [purchaseCreate, setPurchaseCreate] = useState(false);
  const [purchaseEdit, setPurchaseEdit] = useState(false);
  const [purchaseDelete, setPurchaseDelete] = useState(false);
  const [selectAllPurchases, setSelectAllPurchases] = useState(false);
  const [quotationView, setQuotationView] = useState(false);
  const [quotationCreate, setQuotationCreate] = useState(false);
  const [quotationEdit, setQuotationEdit] = useState(false);
  const [quotationDelete, setQuotationDelete] = useState(false);
  const [selectAllQuotations, setSelectAllQuotations] = useState(false);
  const [salesReturnView, setSalesReturnView] = useState(false);
  const [salesReturnCreate, setSalesReturnCreate] = useState(false);
  const [salesReturnEdit, setSalesReturnEdit] = useState(false);
  const [salesReturnDelete, setSalesReturnDelete] = useState(false);
  const [selectAllSalesReturn, setSelectAllSalesReturn] = useState(false);
  const [purchaseReturnView, setPurchaseReturnView] = useState(false);
  const [purchaseReturnCreate, setPurchaseReturnCreate] = useState(false);
  const [purchaseReturnEdit, setPurchaseReturnEdit] = useState(false);
  const [purchaseReturnDelete, setPurchaseReturnDelete] = useState(false);
  const [selectAllPurchaseReturn, setSelectAllPurchaseReturn] = useState(false);
  const [customerListView, setCustomerListView] = useState(false);
  const [customerListCreate, setCustomerListCreate] = useState(false);
  const [customerListEdit, setCustomerListEdit] = useState(false);
  const [customerListDelete, setCustomerListDelete] = useState(false);
  const [selectAllCustomerList, setSelectAllCustomerList] = useState(false);
  const [supplierListView, setSupplierListView] = useState(false);
  const [supplierListCreate, setSupplierListCreate] = useState(false);
  const [supplierListEdit, setSupplierListEdit] = useState(false);
  const [supplierListDelete, setSupplierListDelete] = useState(false);
  const [selectAllSupplierList, setSelectAllSupplierList] = useState(false);
  const [reportView, setReportView] = useState(false)
  const [data, setData] = useState({})
  const history = useHistory()

  const Booleans = {
    roleDescription, selectAll, productView, productCreate, productEdit, productDelete, productBarcode, selectAllProducts,
    userView, userCreate, userEdit, userDelete, expenseView, expenseCreate, expenseEdit, expenseDelete,
    saleView, saleCreate, saleEdit, saleDelete, purchaseView, purchaseCreate, purchaseEdit, purchaseDelete,
    quotationView, quotationCreate, quotationEdit, quotationDelete, salesReturnView, salesReturnCreate, salesReturnEdit, salesReturnDelete,
    purchaseReturnView, purchaseReturnCreate, purchaseReturnEdit, purchaseReturnDelete, customerListView, customerListCreate,
    customerListEdit, customerListDelete, supplierListView, supplierListCreate, supplierListEdit, supplierListDelete, reportView,
    selectAllUsers,selectAllExpenses, selectAllSales, selectAllPurchases, selectAllQuotations, selectAllSalesReturn, selectAllPurchaseReturn,
    selectAllCustomerList, selectAllSupplierList
  }

  console.log('booleans', Booleans);

  useEffect(() => {
    const fetchPermissionDetails = async () => {
      try {
        const response = await axios.get(`${settingsUrl}/grouppermissions/${id}`);
        console.log('get: ', response.data);
        setRoleDescription(response.data.roleDescription)
        setData(response.data.selectedPermissions[0]);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchPermissionDetails();
  }, []);

  useEffect(() => {
    if (data) {
      setSelectAll(data.selectAll)
      setUserView(data.userView)
      setUserCreate(data.userCreate)
      setUserEdit(data.userEdit)
      setUserDelete(data.userDelete)
      setSelectAllUsers(data.selectAllUsers)
      setProductView(data.productView)
      setProductCreate(data.productCreate)
      setProductEdit(data.productEdit)
      setProductDelete(data.productDelete)
      setProductBarcode(data.productBarcode)
      setSelectAllProducts(data.selectAllProducts)
      setExpenseView(data.expenseView)
      setExpenseCreate(data.expenseCreate)
      setExpenseEdit(data.expenseEdit)
      setExpenseDelete(data.expenseDelete)
      setSelectAllExpenses(data.selectAllExpenses)
      setSaleView(data.saleView)
      setSaleCreate(data.saleCreate)
      setSaleEdit(data.saleEdit)
      setSaleDelete(data.saleDelete)
      setSelectAllSales(data.selectAllSales)
      setPurchaseView(data.purchaseView)
      setPurchaseCreate(data.purchaseCreate)
      setPurchaseEdit(data.purchaseEdit)
      setPurchaseDelete(data.purchaseDelete)
      setSelectAllPurchases(data.selectAllPurchases)
      setQuotationView(data.quotationView)
      setQuotationCreate(data.quotationCreate)
      setQuotationEdit(data.quotationEdit)
      setQuotationDelete(data.quotationDelete)
      setSelectAllQuotations(data.selectAllQuotations)
      setSalesReturnView(data.salesReturnView)
      setSalesReturnCreate(data.salesReturnCreate)
      setSalesReturnEdit(data.salesReturnEdit)
      setSalesReturnDelete(data.salesReturnDelete)
      setSelectAllSalesReturn(data.selectAllSalesReturn)
      setPurchaseReturnView(data.purchaseReturnView)
      setPurchaseReturnCreate(data.purchaseReturnCreate)
      setPurchaseReturnEdit(data.purchaseReturnEdit)
      setPurchaseReturnDelete(data.purchaseReturnDelete)
      setSelectAllPurchaseReturn(data.selectAllPurchaseReturn)
      setCustomerListView(data.customerListView)
      setCustomerListCreate(data.customerListCreate)
      setCustomerListEdit(data.customerListEdit)
      setCustomerListDelete(data.customerListDelete)
      setSelectAllCustomerList(data.selectAllCustomerList)
      setSupplierListView(data.supplierListView)
      setSupplierListCreate(data.supplierListCreate)
      setSupplierListEdit(data.supplierListEdit)
      setSupplierListDelete(data.supplierListDelete)
      setSelectAllSupplierList(data.selectAllSupplierList)
      setReportView(data.reportView)
    }
  }, [data]);

  const EditPermission = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`${settingsUrl}/grouppermissions/${id}`, Booleans)
        .then((response) => {
          const data = response.data
          console.log('data: ', data);
          history.push('/dream-pos/settings/grouppermissions');
        })
    } catch (error) {
      console.log(error);
    }
  };
  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Update the corresponding state based on checkbox name
    switch (name) {
      case "userView":
        setUserView(checked);
        break;
      case "userCreate":
        setUserCreate(checked);
        break;
      case "userEdit":
        setUserEdit(checked);
        break;
      case "userDelete":
        setUserDelete(checked);
        break;


      case "productView":
        setProductView(checked);
        break;
      case "productCreate":
        setProductCreate(checked);
        break;
      case "productEdit":
        setProductEdit(checked);
        break;
      case "productDelete":
        setProductDelete(checked);
        break;
      case "productBarcode":
        setProductBarcode(checked);
        break;

      case "expenseView":
        setExpenseView(checked);
        break;
      case "expenseCreate":
        setExpenseCreate(checked);
        break;
      case "expenseEdit":
        setExpenseEdit(checked);
        break;
      case "expenseDelete":
        setExpenseDelete(checked);
        break;


      case "saleView":
        setSaleView(checked);
        break;
      case "saleCreate":
        setSaleCreate(checked);
        break;
      case "saleEdit":
        setSaleEdit(checked);
        break;
      case "saleDelete":
        setSaleDelete(checked);
        break;


      case "purchaseView":
        setPurchaseView(checked);
        break;
      case "purchaseCreate":
        setPurchaseCreate(checked);
        break;
      case "purchaseEdit":
        setPurchaseEdit(checked);
        break;
      case "purchaseDelete":
        setPurchaseDelete(checked);
        break;


      case "quotationView":
        setQuotationView(checked);
        break;
      case "quotationCreate":
        setQuotationCreate(checked);
        break;
      case "quotationEdit":
        setQuotationEdit(checked);
        break;
      case "quotationDelete":
        setQuotationDelete(checked);
        break;


      case "salesReturnView":
        setSalesReturnView(checked);
        break;
      case "salesReturnCreate":
        setSalesReturnCreate(checked);
        break;
      case "salesReturnEdit":
        setSalesReturnEdit(checked);
        break;
      case "salesReturnDelete":
        setSalesReturnDelete(checked);
        break;


      case "purchaseReturnView":
        setPurchaseReturnView(checked);
        break;
      case "purchaseReturnCreate":
        setPurchaseReturnCreate(checked);
        break;
      case "purchaseReturnEdit":
        setPurchaseReturnEdit(checked);
        break;
      case "purchaseReturnDelete":
        setPurchaseReturnDelete(checked);
        break;

      case "customerListView":
        setCustomerListView(checked);
        break;
      case "customerListCreate":
        setCustomerListCreate(checked);
        break;
      case "customerListEdit":
        setCustomerListEdit(checked);
        break;
      case "customerListDelete":
        setCustomerListDelete(checked);
        break;

      case "supplierListView":
        setSupplierListView(checked);
        break;
      case "supplierListCreate":
        setSupplierListCreate(checked);
        break;
      case "supplierListEdit":
        setSupplierListEdit(checked);
        break;
      case "supplierListDelete":
        setSupplierListDelete(checked);
        break;

      case "reportView":
        setReportView(checked);
        break;

      // Add more cases for other checkboxes if needed
      default:
        break;
    }

    if (userView && userCreate && userEdit && userDelete) {
      setSelectAllUsers(true);
    } else {
      setSelectAllUsers(false);
    }

    if (productView && productCreate && productEdit && productDelete && productBarcode) {
      setSelectAllProducts(true);
    } else {
      setSelectAllProducts(false);
    }

    if (expenseView && expenseCreate && expenseEdit && expenseDelete) {
      setSelectAllExpenses(true);
    } else {
      setSelectAllExpenses(false);
    }

    if (saleView && saleCreate && saleEdit && saleDelete) {
      setSelectAllSales(true);
    } else {
      setSelectAllSales(false);
    }

    if (purchaseView && purchaseCreate && purchaseEdit && purchaseDelete) {
      setSelectAllPurchases(true);
    } else {
      setSelectAllPurchases(false);
    }

    if (quotationView && quotationCreate && quotationEdit && quotationDelete) {
      setSelectAllQuotations(true);
    } else {
      setSelectAllQuotations(false);
    }

    if (salesReturnView && salesReturnCreate && salesReturnEdit && salesReturnDelete) {
      setSelectAllSalesReturn(true);
    } else {
      setSelectAllSalesReturn(false);
    }

    if (purchaseReturnView && purchaseReturnCreate && purchaseReturnEdit && purchaseReturnDelete) {
      setSelectAllPurchaseReturn(true);
    } else {
      setSelectAllPurchaseReturn(false);
    }

    if (customerListView && customerListCreate && customerListEdit && customerListDelete) {
      setSelectAllCustomerList(true);
    } else {
      setSelectAllCustomerList(false);
    }

    if (supplierListView && supplierListCreate && supplierListEdit && supplierListDelete) {
      setSelectAllSupplierList(true);
    } else {
      setSelectAllSupplierList(false);
    }


  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    setSelectAllUsers(checked);
    setUserView(checked);
    setUserCreate(checked);
    setUserEdit(checked);
    setUserDelete(checked);
    setSelectAllProducts(checked);
    setProductView(checked);
    setProductCreate(checked);
    setProductEdit(checked);
    setProductDelete(checked);
    setProductBarcode(checked)
    setSelectAllExpenses(checked);
    setExpenseView(checked);
    setExpenseCreate(checked);
    setExpenseEdit(checked);
    setExpenseDelete(checked);
    setSelectAllExpenses(checked);
    setExpenseView(checked);
    setExpenseCreate(checked);
    setExpenseEdit(checked);
    setExpenseDelete(checked);
    setSelectAllSales(checked);
    setSaleView(checked);
    setSaleCreate(checked);
    setSaleEdit(checked);
    setSaleDelete(checked);
    setSelectAllPurchases(checked);
    setPurchaseView(checked);
    setPurchaseCreate(checked);
    setPurchaseEdit(checked);
    setPurchaseDelete(checked);
    setSelectAllQuotations(checked);
    setQuotationView(checked);
    setQuotationCreate(checked);
    setQuotationEdit(checked);
    setQuotationDelete(checked);
    setSelectAllSalesReturn(checked);
    setSalesReturnView(checked);
    setSalesReturnCreate(checked);
    setSalesReturnEdit(checked);
    setSalesReturnDelete(checked);
    setSelectAllPurchaseReturn(checked);
    setPurchaseReturnView(checked);
    setPurchaseReturnCreate(checked);
    setPurchaseReturnEdit(checked);
    setPurchaseReturnDelete(checked);
    setSelectAllCustomerList(checked);
    setCustomerListView(checked);
    setCustomerListCreate(checked);
    setCustomerListEdit(checked);
    setCustomerListDelete(checked);
    setSelectAllSupplierList(checked);
    setSupplierListView(checked);
    setSupplierListCreate(checked);
    setSupplierListEdit(checked);
    setSupplierListDelete(checked);
    setReportView(checked)
  };

  const handleSelectAllChangeUsers = (event) => {
    const { checked } = event.target;
    setSelectAllUsers(checked);
    setUserView(checked);
    setUserCreate(checked);
    setUserEdit(checked);
    setUserDelete(checked);
  };


  const handleSelectAllChangeProducts = (event) => {
    const { checked } = event.target;
    setSelectAllProducts(checked);
    setProductView(checked);
    setProductCreate(checked);
    setProductEdit(checked);
    setProductDelete(checked);
    setProductBarcode(checked)
  };

  const handleSelectAllChangeExpenses = (event) => {
    const { checked } = event.target;
    setSelectAllExpenses(checked);
    setExpenseView(checked);
    setExpenseCreate(checked);
    setExpenseEdit(checked);
    setExpenseDelete(checked);
  };


  const handleSelectAllChangeSales = (event) => {
    const { checked } = event.target;
    setSelectAllSales(checked);
    setSaleView(checked);
    setSaleCreate(checked);
    setSaleEdit(checked);
    setSaleDelete(checked);
  };


  const handleSelectAllChangePurchases = (event) => {
    const { checked } = event.target;
    setSelectAllPurchases(checked);
    setPurchaseView(checked);
    setPurchaseCreate(checked);
    setPurchaseEdit(checked);
    setPurchaseDelete(checked);
  };


  const handleSelectAllChangeQuotations = (event) => {
    const { checked } = event.target;
    setSelectAllQuotations(checked);
    setQuotationView(checked);
    setQuotationCreate(checked);
    setQuotationEdit(checked);
    setQuotationDelete(checked);
  };


  const handleSelectAllChangeSalesReturn = (event) => {
    const { checked } = event.target;
    setSelectAllSalesReturn(checked);
    setSalesReturnView(checked);
    setSalesReturnCreate(checked);
    setSalesReturnEdit(checked);
    setSalesReturnDelete(checked);
  };


  const handleSelectAllChangePurchaseReturn = (event) => {
    const { checked } = event.target;
    setSelectAllPurchaseReturn(checked);
    setPurchaseReturnView(checked);
    setPurchaseReturnCreate(checked);
    setPurchaseReturnEdit(checked);
    setPurchaseReturnDelete(checked);
  };

  const handleSelectAllChangeCustomerList = (event) => {
    const { checked } = event.target;
    setSelectAllCustomerList(checked);
    setCustomerListView(checked);
    setCustomerListCreate(checked);
    setCustomerListEdit(checked);
    setCustomerListDelete(checked);
  };

  const handleSelectAllChangeSupplierList = (event) => {
    const { checked } = event.target;
    setSelectAllSupplierList(checked);
    setSupplierListView(checked);
    setSupplierListCreate(checked);
    setSupplierListEdit(checked);
    setSupplierListDelete(checked);
  };


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Edit Permission</h4>
            <h6>Manage Edit Permissions</h6>
          </div>
        </div>
        {/* /product list */}
        <form action="" onSubmit={EditPermission}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                {/* <div className="col-lg-3 col-sm-12">
                  <div className={`form-group ${noroleData ? 'error' : ''}`}>
                    <label className={`${noroleData ? 'error-message' : ''}`}>Role</label>
                    <input type="text" value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`${noroleData ? 'error' : ''}`} />
                    {noroleData && (
                      <span className="error-message">Please check the Role</span>
                    )}
                  </div>
                </div> */}
                <div className="col-lg-9 col-sm-12">
                  <div className="form-group">
                    <label>Role Description</label>
                    <input type="text" value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)} />
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="input-checkset">
                    <ul>
                      <li>
                        <label className="inputcheck">
                          Select All
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                          <span className="checkmark" />
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="productdetails product-respon">
                    <ul>
                      <li>
                        <h4>Users Management</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="userView"
                                  checked={userView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="userCreate"
                                  checked={userCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="userEdit"
                                  checked={userEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="userDelete"
                                  checked={userDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            {/* <li>
                            <label className="inputcheck">
                              View all records of all users
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li> */}
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllUsers}
                                  onChange={handleSelectAllChangeUsers}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* <li>
                      <h4>User Permission</h4>
                      <div className="input-checkset">
                        <ul>
                          <li>
                            <label className="inputcheck">
                              View
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Create
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Edit
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Delete
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Select All
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                        </ul>
                      </div>
                    </li> */}
                      <li>
                        <h4>Products</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="productView"
                                  checked={productView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="productEdit"
                                  checked={productEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="productDelete"
                                  checked={productDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Barcode
                                <input
                                  type="checkbox"
                                  name="productBarcode"
                                  checked={productBarcode}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            {/* <li>
                            <label className="inputcheck">
                              Import Products
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li> */}
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllProducts}
                                  onChange={handleSelectAllChangeProducts}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* <li>
                      <h4>Adjustment</h4>
                      <div className="input-checkset">
                        <ul>
                          <li>
                            <label className="inputcheck">
                              View
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Create
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Edit
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Delete
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Select All
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                        </ul>
                      </div>
                    </li> */}
                      {/* <li>
                      <h4>Transfer</h4>
                      <div className="input-checkset">
                        <ul>
                          <li>
                            <label className="inputcheck">
                              View
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Create
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Edit
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Delete
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                          <li>
                            <label className="inputcheck">
                              Select All
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </li>
                        </ul>
                      </div>
                    </li> */}
                      <li>
                        <h4>Expenses</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="expenseView"
                                  checked={expenseView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="expenseCreate"
                                  checked={expenseCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="expenseEdit"
                                  checked={expenseEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="expenseDelete"
                                  checked={expenseDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllExpenses}
                                  onChange={handleSelectAllChangeExpenses}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Sales</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="saleView"
                                  checked={saleView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="saleCreate"
                                  checked={saleCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="saleEdit"
                                  checked={saleEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="saleDelete"
                                  checked={saleDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllSales}
                                  onChange={handleSelectAllChangeSales}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Purchase</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="purchaseView"
                                  checked={purchaseView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="purchaseCreate"
                                  checked={purchaseCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="purchaseEdit"
                                  checked={purchaseEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="purchaseDelete"
                                  checked={purchaseDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllPurchases}
                                  onChange={handleSelectAllChangePurchases}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Quotations</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="quotationView"
                                  checked={quotationView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="quotationCreate"
                                  checked={quotationCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="quotationEdit"
                                  checked={quotationEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="quotationDelete"
                                  checked={quotationDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllQuotations}
                                  onChange={handleSelectAllChangeQuotations}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Sales Return</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="salesReturnView"
                                  checked={salesReturnView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="salesReturnCreate"
                                  checked={salesReturnCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="salesReturnEdit"
                                  checked={salesReturnEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="salesReturnDelete"
                                  checked={salesReturnDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllSalesReturn}
                                  onChange={handleSelectAllChangeSalesReturn}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Purchase Return</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="purchaseReturnView"
                                  checked={purchaseReturnView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="purchaseReturnCreate"
                                  checked={purchaseReturnCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="purchaseReturnEdit"
                                  checked={purchaseReturnEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="purchaseReturnDelete"
                                  checked={purchaseReturnDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllPurchaseReturn}
                                  onChange={handleSelectAllChangePurchaseReturn}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      {/* <li>
                        <h4>Payment Sales</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li> */}
                      {/* <li>
                        <h4>Payments purchase</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li> */}
                      {/* <li>
                        <h4>Payments Return</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li>
                          urchase                        </div>
                      </li> */}
                      <li>
                        <h4>Customer list</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="customerListView"
                                  checked={customerListView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="customerListCreate"
                                  checked={customerListCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="customerListEdit"
                                  checked={customerListEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="customerListDelete"
                                  checked={customerListDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllCustomerList}
                                  onChange={handleSelectAllChangeCustomerList}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Supplier List</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="supplierListView"
                                  checked={supplierListView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="supplierListCreate"
                                  checked={supplierListCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="supplierListEdit"
                                  checked={supplierListEdit}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="supplierListDelete"
                                  checked={supplierListDelete}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input
                                  type="checkbox"
                                  checked={selectAllSupplierList}
                                  onChange={handleSelectAllChangeSupplierList}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <h4>Reports</h4>
                        <div className="input-checkset">
                          <ul>
                            <li>
                              <label className="inputcheck">
                                View
                                <input
                                  type="checkbox"
                                  name="reportView"
                                  checked={reportView}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            {/* <li>
                              <label className="inputcheck">
                                Create
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li> */}
                            {/* <li>
                              <label className="inputcheck">
                                Edit
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Delete
                                <input
                                  type="checkbox"
                                  name="productCreate"
                                  checked={productCreate}
                                  onChange={handleCheckboxChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </li>
                            <li>
                              <label className="inputcheck">
                                Select All
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </li> */}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-submit mt-3">
                      Submit
                    </button>
                    <Link
                      to="/dream-pos/settings/grouppermissions"
                      className="btn btn-cancel ms-3 mt-3"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Editpermission;
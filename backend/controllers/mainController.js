import customerModel from "../models/peoples/customerModel.js";
import salesModel from "../models/peoples/salesModel.js";
import supplierModel from "../models/peoples/supplierModel.js";
import productModel from "../models/products/productModel.js";
import products from "../models/products/productModel.js";
import purchaseModel from "../models/purchase/purchaseModel.js";
import IndividualCurrency from "../models/settings/currency/individualCurrencyModel.js";


export const getDashboard = async (req, res) => {
  let totalSalesDueAmount = 0;
  let totalSalesAmount = 0;
  let totalPayingAmount = 0;
  let totalPurchaseAmount = 0;
  
  try {
    const { selectedYear } = req.body; // Assuming selectedYear is sent from frontend
    console.log(selectedYear);
    const customers = await customerModel.find();
    const suppliers = await supplierModel.find();
    const purchaseInvoice = await purchaseModel.find();
    const salesInvoice = await salesModel.find({ invoice: true });
    const customersTotalNumber = customers.length;
    const suppliersTotalNumber = suppliers.length;
    const purchaseInvoiceTotalNumber = purchaseInvoice.length;
    const salesInvoiceTotalNumber = salesInvoice.length;
    const salesData = await salesModel.find();
    salesData.forEach((sale) => {
      totalSalesDueAmount += sale.dueAmount;
    });
    salesData.forEach((sale) => {
      totalSalesAmount += sale.receivedAmount;
    });
    salesData.forEach((sale) => {
      totalPayingAmount += sale.payingAmount;
    });
    purchaseInvoice.forEach((purchase) => {
      totalPurchaseAmount += purchase.grandTotalNumber;
    });
    // Fetching required data
    const currencyDatas = await IndividualCurrency.find();
    const currencyData = currencyDatas[0];
    // console.log(currencyData)
    // if (recentlyAddedProducts.length == 0) {
    //   const createEntry = await products.create();
    //   return res.status(200).send(createEntry);
    // }
    // Calculating total sales and purchase amounts

    // Filtering data by date
    const currentDate = new Date();
    const selectedDate = new Date(selectedYear, currentDate.getMonth()); // Date for the selected year and current month

    const salesDataFiltered = salesData.filter((sale) => {
      const saleDate = new Date(sale.startDate); // Change "startDate" to your actual date field
      return (
        saleDate.getMonth() === selectedDate.getMonth() &&
        saleDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    const purchaseDataFiltered = purchaseInvoice.filter((purchase) => {
      const purchaseDate = new Date(purchase.purchaseDate); // Change "purchaseDate" to your actual date field
      return (
        purchaseDate.getMonth() === selectedDate.getMonth() &&
        purchaseDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    const recentlyAddedProducts = await productModel
      .find()
      .sort({ dateAdded: -1 })
      .limit(4);

    // Getting lengths of filtered data
    const salesDataLength = salesDataFiltered.length;
    const purchaseDataLength = purchaseDataFiltered.length;

    // Prepare data for the graph series
    const salesSeriesData = salesDataFiltered.map(
      (sale) => sale.receivedAmount
    );
    const purchaseSeriesData = purchaseDataFiltered.map(
      (purchase) => -purchase.grandTotalNumber
    ); // Invert the sign here

    // Fetch expired products
    const productData = await products
      .find({
        expiryDate: { $lt: currentDate }, // Products with expiryDate less than currentDate
      })
      .populate({
        path: "category",
        select: "categoryName -_id", // Exclude _id from the populated field
      })
      .populate({
        path: "brand",
        select: "brandName -_id", // Exclude _id from the populated field
      });

    const formatDate = (dateString) => {
      const databaseDate = new Date(dateString);
      const day = databaseDate.getDate().toString().padStart(2, "0");
      const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
      const year = databaseDate.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const fetchExpiredProducts = productData
      .filter((product) => new Date(product.expiryDate) < currentDate)
      .map((product) => ({
        ...product._doc,
        expiryDate: formatDate(product.expiryDate),
        category: product.category ? product.category.categoryName : null,
        brand: product.brand ? product.brand.brandName : null,
      }));

    // check //
    // const fetchRecentProducts = recentlyAddedProducts
    //   .filter((product) => new Date(product.expiryDate) < currentDate)
    //   .map((product) => ({
    //     ...product._doc,
    //     expiryDate: formatDate(product.expiryDate),
    //     category: product.category ? product.category.categoryName : null,
    //     brand: product.brand ? product.brand.brandName : null,
    //   }));

    res.status(200).send({
      success: true,
      message: "Dashboard fetched successfully!!",
      fetchExpiredProducts,
      recentlyAddedProducts,
      customersTotalNumber,
      suppliersTotalNumber,
      purchaseInvoiceTotalNumber,
      salesInvoiceTotalNumber,
      totalSalesDueAmount,
      totalSalesAmount,
      totalPayingAmount,
      totalPurchaseAmount,
      currencyData,
      salesDataLength,
      purchaseDataLength,
      salesSeriesData,
      purchaseSeriesData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Dashboard API!",
      error,
    });
  }
};

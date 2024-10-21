import csv from "csv-parser";
import { Readable } from "stream";
import purchaseModel from "../models/purchase/purchaseModel.js";
import returnPurchaseModel from "./../models/purchase/returnPurchaseModel.js";
import productModel from "./../models/products/productModel.js";
import salesModel from "../models/peoples/salesModel.js";

// GET ALL PURCHASES //
export const getPurchase = async (req, res) => {
  try {
    const purchaseList = await purchaseModel.find().populate({
      path: "supplierName",
      select: "supplierName -_id", // Include _id from the populated field
    });

    const purchase = purchaseList.map((purchase) => {
      // Convert the date format
      const formatDate = (dateString) => {
        const databaseDate = new Date(dateString);
        const day = databaseDate.getDate().toString().padStart(2, "0");
        const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
        const year = databaseDate.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Map other properties
      return {
        ...purchase._doc,
        purchaseDate: formatDate(purchase.purchaseDate),
        supplierName: purchase.supplierName
          ? purchase.supplierName.supplierName
          : null,
      };
    });
    console.log("purchase: ", purchase);
    res.status(200).send(purchase);
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .send({
        message: "Error in fetching cutomer details",
        success: false,
        error,
      });
  }
};

// GET PURCHASE BY ID //
export const getPurchaseById = async (req, res) => {
  const purchaseId = req.params.id;
  const purchase = await purchaseModel
    .findById(purchaseId)
    .populate("supplierName")
    .populate("productName");
  try {
    // valdiation //
    if (!purchase) {
      return res.status(404).send({
        success: false,
        message: "purchase not found!!",
      });
    }
    res.status(200).send({
      success: true,
      message: "purchase Found",
      purchase,
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID not found //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In get purchase by ID API",
      error,
    });
  }
};

// CREATE || ADD PURCHASE //
export const addPurchase = async (req, res) => {
  console.log(req.body);
  try {
    const {
      supplierName,
      purchaseDate,
      productName,
      productQuantity,
      referenceNumber,
      orderTax,
      totalDiscount,
      shipping,
      status,
      description,
      grandTotalNumber,
      data,
    } = req.body;
    // const saleData = await salesModel.findOne({reference: referenceNumber})
    // console.log('saleData: ', saleData);
    await purchaseModel.create({
      supplierName,
      purchaseDate,
      productName,
      productQuantity,
      referenceNumber,
      orderTax,
      totalDiscount,
      shipping,
      status,
      description,
      grandTotalNumber,
      // paid: saleData.receivedAmount,
      // dueAmount: saleData.dueAmount,
      // payment_status: saleData.payment_status,
      // paymentType: saleData.paymentType,
      selectedData: data
    });

    for (const item of data) {
      const productName = item.productName;
      const productQuantity = item.quantity;

      // Find the product by productName
      const product = await productModel.findOne({ productName });

      if (product) {
          // Update the product quantity
          product.qty -= productQuantity;
          await product.save();
      } else {
          // Handle case where product is not found
          console.log(`Product with name ${productName} not found.`);
      }
  }
  console.log("Product stocks updated successfully.");

    // UPDATING THE STOCK OF PRODUCT //
    // const product = await productModel.findOne(productName);
    // console.log('pro: ', product);
    // product.qty -= productQuantity;
    // await product.save();

    res.status(201).send({
      success: true,
      message: "purchase added successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in return purchase API!!",
      error,
    });
  }
};

// EDIT PURCHASE //
export const editPurchase = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    // find purchase //
    const purchaseToEdit = await purchaseModel.findById(id);
    if (!purchaseToEdit) {
      return res.status(404).send({
        success: false,
        message: "purchase not found!",
      });
    }
    const {
      supplierName,
      purchaseDate,
      productName,
      referenceNumber,
      orderTax,
      totalDiscount,
      shipping,
      status,
      description,
      grandTotalNumber,
      selectedProducts,
    } = req.body;
    // check which one to be updated and update accordingly //
    if (supplierName) purchaseToEdit.supplierName = supplierName;
    if (purchaseDate) purchaseToEdit.purchaseDate = purchaseDate;
    if (productName) purchaseToEdit.productName = productName;
    if (referenceNumber) purchaseToEdit.referenceNumber = referenceNumber;
    if (orderTax) purchaseToEdit.orderTax = orderTax;
    if (totalDiscount) purchaseToEdit.discount = totalDiscount;
    if (shipping) purchaseToEdit.shipping = shipping;
    if (status) purchaseToEdit.status = status;
    if (description) purchaseToEdit.description = description;
    if (grandTotalNumber) purchaseToEdit.grandTotalNumber = grandTotalNumber;
    if (selectedProducts) purchaseToEdit.selectedData = selectedProducts;

    await purchaseToEdit.save();
    res.status(200).send({
      success: true,
      message: "Purchase details updated successfully!!",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid purchase id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In PURCHASE  API!!",
      error,
    });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    // find product
    const purchase = await purchaseModel.findById(req.params.id);
    // validation
    if (!purchase) {
      return res.status(404).send({
        success: false,
        message: "Purchase not found!!",
      });
    }

    // find supplier with this purchase id and delete the same in supplier too //
    // const suppliers=await supplierModel.find({purchase:purchase._id})
    // // update supplier details //
    // for(let i=0;i<suppliers.length;i++){
    //   const supplier = suppliers[i];
    //   product.category = undefined;
    //   await product.save();
    // }

    await purchase.deleteOne();
    res.status(200).send({
      success: true,
      message: "Purchase DELETED Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "INVALID ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE PURCHASE API!",
      error,
    });
  }
};

export const getPurchaseOrderList = async (req, res) => {
  try {
    const purchaseList = await purchaseModel.aggregate([
      {
        $unwind: "$selectedData", // Deconstruct the selectedData array
      },
      {
        $group: {
          _id: "$selectedData.productName",
          totalQuantity: { $sum: "$selectedData.quantity" },
          totalPrice: { $sum: "$selectedData.subTotal" },
          image: { $first: "$selectedData.image" }, // Assuming image is an array, get the first element
          qty: { $first: "$selectedData.qty" },
        },
      },
      {
        $project: {
          productName: "$_id",
          totalQuantity: 1,
          totalPrice: 1,
          image: 1,
          qty: 1,
          _id: 1,
        },
      },
    ]);
    console.log("purchase: ", purchaseList);
    res.status(200).send(purchaseList);
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .send({
        message: "Error in fetching cutomer details",
        success: false,
        error,
      });
  }
};

export const getReturnPurchase = async (req, res) => {
  try {
    const returnPurchase = await returnPurchaseModel.find().populate({
      path: "supplier",
      select: "supplierName -_id",
    });

    const purchase = returnPurchase.map((purchase) => {
      // Convert the date format
      const formatDate = (dateString) => {
        const databaseDate = new Date(dateString);
        const day = databaseDate.getDate().toString().padStart(2, "0");
        const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
        const year = databaseDate.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Map other properties
      return {
        ...purchase._doc,
        quotationDate: formatDate(purchase.quotationDate),
        supplier: purchase.supplier ? purchase.supplier.supplierName : null,
      };
    });
    res.status(200).send({
      success: true,
      message: "All return purchases fetched successfully!!",
      purchase,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get return purchase api!",
      error,
    });
  }
};

export const createReturnPurchase = async (req, res) => {
  console.log(req.body);
  try {
    const {
      supplier,
      quotationDate,
      referenceNumber,
      orderTax,
      discount,
      shipping,
      status,
      description,
      grandTotalNumber,
      data,
    } = req.body;
    const saleData = await salesModel.findOne({ reference: referenceNumber });
    console.log("saleData: ", saleData);
    await returnPurchaseModel.create({
      supplier,
      quotationDate,
      referenceNumber,
      orderTax,
      discount,
      shipping,
      status,
      description,
      grandTotalNumber,
      paid: saleData.receivedAmount,
      dueAmount: saleData.dueAmount,
      payment_status: saleData.payment_status,
      selectedData: data,
    });

    // UPDATING THE STOCK OF PRODUCT IN THE PRODUCT DB //
    // const product = await productModel.findOne(productName);
    // product.qty += quantity;
    // await product.save();

    res.status(201).send({
      success: true,
      message: "return purchase added successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create return purchase API!!",
      error,
    });
  }
};

export const getReturnPurchaseById = async (req, res) => {
  const purchaseId = req.params.id;
  const purchase = await returnPurchaseModel
    .findById(purchaseId)
    .populate("supplier");
  try {
    // valdiation //
    if (!purchase) {
      return res.status(404).send({
        success: false,
        message: "purchase not found!!",
      });
    }
    res.status(200).send({
      success: true,
      message: "purchase Found",
      purchase,
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID not found //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In get purchase by ID API",
      error,
    });
  }
};

export const editReturnPurchase = async (req, res) => {
  try {
    // find return purchase //
    const returnPurchase = await returnPurchaseModel.findById(req.params.id);
    if (!returnPurchase) {
      return res.status(404).send({
        success: false,
        message: "return purchase not found!",
      });
    }
    const {
      supplier,
      quotationDate,
      productName,
      referenceNumber,
      orderTax,
      discount,
      shipping,
      status,
      description,
      grandTotalNumber,
      selectedProducts,
    } = req.body;
    // check which one to update and update accordingly //
    if (supplier) returnPurchase.supplier = supplier;
    if (quotationDate) returnPurchase.quotationDate = quotationDate;
    if (productName) returnPurchase.productName = productName;
    if (referenceNumber) returnPurchase.referenceNumber = referenceNumber;
    if (orderTax) returnPurchase.orderTax = orderTax;
    if (discount) returnPurchase.discount = discount;
    if (shipping) returnPurchase.shipping = shipping;
    if (status) returnPurchase.status = status;
    if (description) returnPurchase.description = description;
    if (grandTotalNumber) returnPurchase.grandTotalNumber = grandTotalNumber;
    if (selectedProducts) returnPurchase.selectedData = selectedProducts;
    await returnPurchase.save();
    res.status(200).send({
      success: true,
      message: "return purchase details updated!!!",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid return purchase id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In RETURN PURCHASE  API!!",
      error,
    });
  }
};

export const deleteReturnPurchase = async (req, res) => {
  try {
    // find product
    const returnPurchase = await returnPurchaseModel.findById(req.params.id);
    // validation
    if (!returnPurchase) {
      return res.status(404).send({
        success: false,
        message: "Return Purchase not found!!",
      });
    }

    await returnPurchase.deleteOne();
    res.status(200).send({
      success: true,
      message: "Return Purchase DELETED Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "INVALID ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE PURCHASE API!",
      error,
    });
  }
};

export const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file.buffer.toString("utf8");
  console.log("file: ", file);

  let data = [];
  const stream = Readable.from([file]); // Create a readable stream from the file buffer
  stream
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", () => {
      // YourModel.insertMany(data)
      //   .then(() => {
      //     console.log('Data saved to database');
      //     res.status(200).send('File uploaded and data saved to database.');
      //   })
      //   .catch((error) => {
      //     console.error('Error saving data:', error);
      //     res.status(500).send('Error saving data to database.');
      //   });

      console.log("CSV file parsed:", data);
      res.status(200).send(data);
    })
    .on("error", (error) => {
      console.error("Error parsing CSV:", error);
      res.status(500).send("Error parsing CSV.");
    });
};

// fs.createReadStream(file)
//   .pipe(csv())
//   .on('data', (row) => {
//     data.push(row);
//   })
//   .on('end', () => {
// Process 'data' - You can save it to your database here

// For example, assuming 'YourModel' is your Mongoose model
// You would save 'data' to your MongoDB collection
// YourModel.insertMany(data)
//   .then(() => {
//     console.log('Data saved to database');
//     res.status(200).send('File uploaded and data saved to database.');
//   })
//   .catch((error) => {
//     console.error('Error saving data:', error);
//     res.status(500).send('Error saving data to database.');
//   });

//   console.log('CSV file parsed:', data);
//   res.status(200).send('CSV file parsed successfully.');
// });

export const addImportPurchase = async (req, res) => {
  try {
    let {
      supplier,
      orderTax,
      discount,
      shipping,
      description,
      status,
      productFile,
    } = req.body;
    if (status === "") {
      status = "Pending";
    }
    const purchaseData = new purchaseModel({
      supplierName: supplier,
      purchaseDate: new Date(),
      orderTax,
      discount,
      shipping,
      description,
      status,
      selectedData: productFile,
    });
    purchaseData.save();
    res.status(200).send({ success: true });
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .send({ message: "Error in add sales", success: false, error });
  }
}

export const getPurchaseReport = async (req, res) => {
  try {
    const purchaseData = await purchaseModel.find()
    .populate({
      path: "supplierName",
      select: "supplierName -_id"
    })
    const purchaseList = purchaseData.map(purchase => {
      // Convert the date format
      const formatDate = (dateString) => {
        const databaseDate = new Date(dateString);
        const day = databaseDate.getDate().toString().padStart(2, "0");
        const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
        const year = databaseDate.getFullYear();
        return `${day}-${month}-${year}`;
      };


      // Map other properties
      return {
        ...purchase._doc,
        purchaseDate: formatDate(purchase.purchaseDate),
        supplierName: purchase.supplierName ? purchase.supplierName.supplierName : null,
        quantity: purchase.selectedData ? purchase.selectedData.reduce((total, item) => total + item.quantity, 0) : null
      };
    });
    console.log("purchase: ", purchaseList);
    res.status(200).send(purchaseList);
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send({ message: "Error in fetching cutomer details", success: false, error });
  }
}


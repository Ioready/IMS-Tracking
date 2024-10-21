import GeneralSettings from "../models/settings/generalSettingsModel.js";
import emailSettingsModel from "../models/settings/emailSettingsModel.js";
import paymentSettingsModel from "../models/settings/paymentSettingsModel.js";
import Currency from "../models/settings/currency/currencyModel.js";
import IndividualCurrency from "../models/settings/currency/individualCurrencyModel.js";
import Tax from "../models/settings/tax/taxModel.js";
import IndividualTax from "./../models/settings/tax/individualTaxModel.js";
import Permission from "./../models/settings/groupPermissions/permissionsModel.js";
import userModel from "../models/peoples/userModel.js";

/* GENERAL SETTINGS CONTROLLER */

// get settings //
export const getGeneralSettingsController = async (req, res) => {
  try {
    const settingsList = await GeneralSettings.find();
    // if (settingsList.length > 0) {
    //   res.status(200).send(settingsList[0]);
    // } else {
    //   const create = await generalSettingsModel.create();
    //   res.status(200).send(create);
    // }
    // .populate({
    //   path: "email",
    //   select: "email -_id", // Include _id from the populated field
    // })
    // .populate({
    //   path: "phone",
    //   select: "phone -_id", // Include _id from the populated field
    // })
    // .populate({
    //   path: "address",
    //   select: "address -_id", // Include _id from the populated field
    // })
    // .populate({
    //   path: "image",
    //   select: "image -_id", // Include _id from the populated field
    // });

    // const setting = settingsList.map((setting) => {
    //   // Convert the date format
    //   const formatDate = (dateString) => {
    //     const databaseDate = new Date(dateString);
    //     const day = databaseDate.getDate().toString().padStart(2, "0");
    //     const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
    //     const year = databaseDate.getFullYear();
    //     return `${day}-${month}-${year}`;
    //   };

    // Map other properties
    //   return {
    //     ...setting._doc,
    //     date: formatDate(setting.date),
    //     email: setting.email ? setting.email.email : null,
    //     phone: setting.phone ? setting.phone.phone : null,
    //     address: setting.address ? setting.address.address : null,
    //     image: setting.image ? setting.image.image : null,
    //   };
    // });
    // console.log("generalSettings: ", setting);
    res.status(200).send({
      sucess: true,
      message: "general settings fetched successfully!",
      settingsList,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in fetching general settings api",
      success: false,
      error,
    });
  }
};

// get settings by id //
export const getGeneralSettingsControllerById = async (req, res) => {
  try {
    const id = req.params.id;
    const settingsData = await GeneralSettings.findById(id);
    if (!settingsData) {
      res.status(404).send({
        success: false,
        message: "general settings ID not found!",
      });
    }
    res.status(200).send(settingsData);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: "Error in get settings API!",
    });
  }
};

// add settings //
export const addGeneralSettingsController = async (req, res) => {
  console.log(req.body);
  try {
    const { generalSettingsDatas, image } = req.body;
    const { title, timeZone, currency, dateFormat, email, phone, address } =
      generalSettingsDatas
    // check if settings already present with given email //
    const existingSettings = await GeneralSettings.findOne({ email });
    if (existingSettings) {
      return res.status(500).send({
        success: false,
        message: "settings with given email already exists!!",
      });
    }
    const genaral = await GeneralSettings.create({
      title,
      timeZone,
      currency,
      dateFormat,
      email,
      phone,
      address,
      image,
    });
    await genaral.save()
    res.status(201).send({
      success: true,
      message: "general settings added successfully!!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in adding general settings API",
      success: false,
      error,
    });
  }
};

// edit settings || update settings //
export const updateGeneralSettingsController = async (req, res) => {
  try {
    const id = req.params.id;
    const settingsToEdit = await GeneralSettings.findById(id);
    const { generalSettingsDatas, image } = req.body
    const { title, timeZone, currency, dateFormat, email, phone, address } = generalSettingsDatas
    if (title) settingsToEdit.title = title;
    if (timeZone) settingsToEdit.timeZone = timeZone;
    if (currency) settingsToEdit.currency = currency;
    if (dateFormat) settingsToEdit.dateFormat = dateFormat;
    if (email) settingsToEdit.email = email;
    if (phone) settingsToEdit.phone = phone;
    if (address) settingsToEdit.address = address;
    if (image) settingsToEdit.image = image;
    await settingsToEdit.save()
    res.status(201).send({
      success: true,
      message: "general settings updated successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in update general settings API!!",
      error,
    });
  }
};

/* EMAIL SETTINGS CONTROLLER */

// get email settings //
export const getEmailSettingsController = async (req, res) => {
  try {
    const emailSettingsList = await emailSettingsModel.find();
    if (emailSettingsList.length > 0) {
      res.status(200).send(emailSettingsList[0]);
    } else {
      const createEmailList = await emailSettingsModel.create();
      res.status(200).send(createEmailList);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in fetching general settings api",
      success: false,
      error,
    });
  }
};

// get email settings by id //
export const getEmailSettingsByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const emailsettingsData = await emailSettingsModel.findById(id);
    if (!emailsettingsData) {
      res.status(404).send({
        success: false,
        message: "email settings not found!",
      });
    }
    res.status(200).send(emailsettingsData);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: "Error in get email settings by ID API!",
    });
  }
};

// add email settings //
export const addEmailSettingsController = async (req, res) => {
  console.log(req.body);
  try {
    const {
      mailHost,
      mailPort,
      mailAddress,
      password,
      mailFromName,
      encryption,
    } = req.body;
    // check if email settings already present with given email //
    const existingEmailSettings = await emailSettingsModel.findOne({
      mailAddress,
    });
    if (existingEmailSettings) {
      return res.status(500).send({
        success: false,
        message: "mail settings with given email already exists!!",
      });
    }
    await emailSettingsModel.create({
      mailHost,
      mailPort,
      mailAddress,
      password,
      mailFromName,
      encryption,
    });
    res.status(201).send({
      success: true,
      message: "email settings added successfully!!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in adding email settings API",
      success: false,
      error,
    });
  }
};

// edit || update settings //
export const updateEmailSettingsController = async (req, res) => {
  try {
    const id = req.params.id;
    const settingsToEdit = await emailSettingsModel.findById(id);
    const {
      mailHost,
      mailPort,
      mailAddress,
      password,
      mailFromName,
      encryption,
    } = req.body;
    if (mailHost) settingsToEdit.mailHost = mailHost;
    if (mailPort) settingsToEdit.mailPort = mailPort;
    if (mailAddress) settingsToEdit.mailAddress = mailAddress;
    if (password) settingsToEdit.password = password;
    if (mailFromName) settingsToEdit.mailFromName = mailFromName;
    if (encryption) settingsToEdit.encryption = encryption;
    await settingsToEdit.save()
    res.status(201).send({
      success: true,
      message: "email settings updated successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in update general settings API!!",
      error,
    });
  }
};

/* PAYMENT SETTINGS CONTROLLER STARTS HERE */

// get payment settings controller //
export const getPaymentSettingsController = async (req, res) => {
  try {
    const payments = await paymentSettingsModel.find();
    if (payments.length > 0) {
      res.status(200).send(payments);
    } else {
      const create = await paymentSettingsModel.create();
      res.status(200).send(create);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in add payment settings api",
      success: false,
      error,
    });
  }
};

// get payment settings by id //
export const getPaymentSettingsControllerById = async (req, res) => {
  try {
    const id = req.params.id;
    const payments = await paymentSettingsModel.findById(id);
    res.status(200).send(payments);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in add payment settings api",
      success: false,
      error,
    });
  }
};

// add payment settings controller //
export const addPaymentSettingsController = async (req, res) => {
  try {
    const { paymentType, paymentStatus } = req.body;
    await paymentSettingsModel.create({
      paymentType: paymentType,
      paymentStatus: paymentStatus,
    });
    res.status(201).send({
      success: true,
      message: "payment status added successfully!!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in adding payment details",
      success: false,
      error,
    });
  }
};

// edit payment settings controller //
export const editPaymentSettingsController = async (req, res) => {
  try {
    const id = req.params.id;
    const searchPayments = await paymentSettingsModel.findById(id);
    console.log("search: ", searchPayments);

    // if no payment is added add new payment as blank and return it //
    if (!searchPayments) {
      const createPayment = await paymentSettingsModel.create();
      res.status(200).send(createPayment);
    } else {
      const { paymentType, paymentStatus } = req.body;
      if (paymentType) searchPayments.paymentType = paymentType;
      if (paymentStatus) searchPayments.paymentStatus = paymentStatus;
      await searchPayments.save();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in update payment settings API!!",
      error,
    });
  }
};

/* CURRENCY SETTINGS CONTROLLER STARTS HERE */

// get all currencies //
export const getCurrencySettingsController = async (req, res) => {
  try {
    // finding currencies in currency d/b //
    const getCurrency = await IndividualCurrency.find();
    console.log(getCurrency);
    // since currency d/b is an array of objects, so we check if it is not empty... if not empty send the entire getCurreny //
    if (getCurrency.length > 0) {
      res.status(200).send(getCurrency);
    }
    // if getCurrency.length == 0 it means there is nothing to display in Curreny model, so create an entry in currency model and display blank fields //
    else {
      await Currency.create();
      res.status(200).send(getCurrency);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in get currency settings api",
      success: false,
      error,
    });
  }
};

// add individual currency //
export const addIndividualCurrencyController = async (req, res) => {
  console.log(req.body);
  try {
    const { currencyName, currencyCode, currencySymbol, currencyStatus } =
      req.body;
    const individualCurrency = await IndividualCurrency.create({
      currencyName,
      currencyCode,
      currencySymbol,
      currencyStatus,
    });
    await individualCurrency.save();
  } catch (error) {
    res.status(500).send({
      message: "Error in adding currency details",
      success: false,
      error,
    });
  }
};

// get currency by id //
export const getCurrencySettingsControllerById = async (req, res) => {
  try {
    const id = req.params.id;
    const currencyData = await IndividualCurrency.findById(id);
    res.status(200).send(currencyData);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in add payment settings api",
      success: false,
      error,
    });
  }
};

// edit individual currency //
export const editIndividualCurrencyController = async (req, res) => {
  try {
    const id = req.params.id;
    const currencyToEdit = await IndividualCurrency.findById(id);
    if (!currencyToEdit) {
      res.status(204).send({
        success: false,
        message: "currency not found!",
      });
    }
    const { currencyName, currencyCode, currencySymbol, currencyStatus } =
      req.body;
    if (currencyName) currencyToEdit.currencyName = currencyName;
    if (currencyCode) currencyToEdit.currencyCode = currencyCode;
    if (currencySymbol) currencyToEdit.currencySymbol = currencySymbol;
    if (currencyStatus) currencyToEdit.currencyStatus = currencyStatus;
    await currencyToEdit.save();
    res.status(200).send({
      success: true,
      message: "Currency details updated successfully!!",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid currency id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In EDIT CURRENCY API!!",
      error,
    });
  }
};

// delete individual currency //
export const deleteIndividualCurrencyController = async (req, res) => {
  try {
    const id = req.params.id;
    const currencyToDelete = await IndividualCurrency.findById(id);
    if (!currencyToDelete) {
      return res.status(404).send({
        success: false,
        message: "Currency details not found!!",
      });
    }
    await currencyToDelete.deleteOne();
    res.status(200).send({
      success: true,
      message: "Currency details DELETED Successfully",
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
      message: "ERROR IN DELETE CURRENCY API!",
      error,
    });
  }
};

/* TAX RATES SETTINGS CONTROLLER STARTS HERE */

// get all tax rate //
export const getTaxRateController = async (req, res) => {
  try {

    // finding taxes in tax d/b //
    // since tax d/b is an array of taxes, so we check if it is not empty... if not empty send the entire getTax //
    const getTax = await IndividualTax.find();
    console.log(getTax);
    if (getTax.length > 0) {
      res.status(200).send(getTax);
      // res.status(200).send(getTax);
    }
    // if getTax.length == 0 it means there is nothing to display in tax model, so create an entry in tax model and display blank fields //
    else {
      // await IndividualTax.create();
      res.status(200).send(getTax);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in get tax settings api",
      success: false,
      error,
    });
  }
};

// get tax rate by id //
export const getTaxRateControllerById = async (req, res) => {
  try {
    const id = req.params.id;
    const taxData = await IndividualTax.findById(id);
    if (!taxData) {
      res.status(404).send({
        success: false,
        message: "tax not found!!",
      });
    }
    res.status(200).send(taxData);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in get tax data API",
      success: false,
      error,
    });
  }
};

// add individual tax rate //
export const addIndividualTaxController = async (req, res) => {
  try {
    const { taxName, taxRate, taxStatus } = req.body;
    const tax = await IndividualTax.create({
      taxName,
      taxRate,
      taxStatus,
    });
    await tax.save()
  } catch (error) {
    res.status(500).send({
      message: "Error in adding tax details",
      success: false,
      error,
    });
  }
};

// edit individual tax rate //
export const editIndividualTaxController = async (req, res) => {
  try {
    const id = req.params.id;
    const taxToEdit = await IndividualTax.findById(id);
    if (!taxToEdit) {
      res.status(204).send({
        success: false,
        message: "tax rate not found!",
      });
    }
    const { taxName, taxRate, taxStatus } = req.body;
    if (taxName) taxToEdit.taxName = taxName;
    if (taxRate) taxToEdit.taxRate = taxRate;
    if (taxStatus) taxToEdit.taxStatus = taxStatus;
    await taxToEdit.save();
    res.status(200).send({
      success: true,
      message: "Tax rate details updated successfully!!",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid tax rate id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In EDIT TAX RATE API!!",
      error,
    });
  }
};

// delete individual tax rate //
export const deleteIndividualTaxController = async (req, res) => {
  try {
    const id = req.params.id;
    const taxToDelete = await IndividualTax.findById(id);
    if (!taxToDelete) {
      return res.status(404).send({
        success: false,
        message: "Tax rate details not found!!",
      });
    }
    await taxToDelete.deleteOne();
    res.status(200).send({
      success: true,
      message: "Tax rate details DELETED Successfully",
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
      message: "ERROR IN DELETE TAX RATE API!",
      error,
    });
  }
};

/* GROUP PERMISSIONS CONTROLLER STARTS HERE */

// get group permissions //
export const getGroupPermissionsController = async (req, res) => {
  try {
    const getPermissions = await userModel.find();
    if (getPermissions.length > 0) {
      res.status(200).send(getPermissions);
    } else {
      const createEntryinPermissionsModel = await userModel.create();
      res.status(200).send(createEntryinPermissionsModel);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in get group permissions api",
      success: false,
      error,
    });
  }
};

// get group permissionS by id //
export const getGroupPermissionsByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const permissionsData = await userModel.findById(id);
    if (!permissionsData) {
      res.status(404).send({
        success: false,
        message: "permissions not found!!",
      });
    }
    res.status(200).send(permissionsData);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Error in get permissions data by ID API",
      success: false,
      error,
    });
  }
};

// add group permissions //
export const postGroupPermissionsController = async (req, res) => {
  console.log(req.body);
  try {
    const {
      role,
      roleDescription,
      selectAll,
      userView,
      userCreate,
      userEdit,
      userDelete,
      productView,
      productCreate,
      productEdit,
      productDelete,
      productBarcode,
      selectAllProducts,
      expenseView,
      expenseCreate,
      expenseEdit,
      expenseDelete,
      saleView,
      saleCreate,
      saleEdit,
      saleDelete,
      purchaseView,
      purchaseCreate,
      purchaseEdit,
      purchaseDelete,
      quotationView,
      quotationCreate,
      quotationEdit,
      quotationDelete,
      salesReturnView,
      salesReturnCreate,
      salesReturnEdit,
      salesReturnDelete,
      purchaseReturnView,
      purchaseReturnCreate,
      purchaseReturnEdit,
      purchaseReturnDelete,
      customerListView,
      customerListCreate,
      customerListEdit,
      customerListDelete,
      supplierListView,
      supplierListCreate,
      supplierListEdit,
      supplierListDelete,
      reportView,
      selectAllUsers,
      selectAllExpenses,
      selectAllSales,
      selectAllPurchases,
      selectAllQuotations,
      selectAllSalesReturn,
      selectAllPurchaseReturn,
      selectAllCustomerList,
      selectAllSupplierList
    } = req.body;
    const userRole = await userModel.findOne({ role })
    if (userRole) {
      await userModel.findOneAndUpdate({ role }, {
        $set: {
          roleDescription,
          selectedPermissions: {
            selectAll,
            userView,
            userCreate,
            userEdit,
            userDelete,
            productView,
            productCreate,
            productEdit,
            productDelete,
            productBarcode,
            selectAllProducts,
            expenseView,
            expenseCreate,
            expenseEdit,
            expenseDelete,
            saleView,
            saleCreate,
            saleEdit,
            saleDelete,
            purchaseView,
            purchaseCreate,
            purchaseEdit,
            purchaseDelete,
            quotationView,
            quotationCreate,
            quotationEdit,
            quotationDelete,
            salesReturnView,
            salesReturnCreate,
            salesReturnEdit,
            salesReturnDelete,
            purchaseReturnView,
            purchaseReturnCreate,
            purchaseReturnEdit,
            purchaseReturnDelete,
            customerListView,
            customerListCreate,
            customerListEdit,
            customerListDelete,
            supplierListView,
            supplierListCreate,
            supplierListEdit,
            supplierListDelete,
            reportView,
            selectAllUsers,
            selectAllExpenses,
            selectAllSales,
            selectAllPurchases,
            selectAllQuotations,
            selectAllSalesReturn,
            selectAllPurchaseReturn,
            selectAllCustomerList,
            selectAllSupplierList
          },
        }
      })
      res.status(200).send({
        success: true,
        message: "Permissions details added successfully!!",
      });
    } else {
      res.status(204).send({
        noRole: true,
        message: "No Role in database",
      });
    }
    // await Permission.create({
    //   role,
    //   roleDescription,
    //   productView,
    //   productCreate,
    //   productEdit,
    //   productDelete,
    //   productBarcode,
    //   selectAllProducts
    // });
  } catch (error) {
    res.status(500).send({
      message: "Error in adding group permissions API",
      success: false,
      error,
    });
  }
};

// edit group permissions //
export const editGroupPermissionsController = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      roleDescription,
      selectAll,
      userView,
      userCreate,
      userEdit,
      userDelete,
      productView,
      productCreate,
      productEdit,
      productDelete,
      productBarcode,
      selectAllProducts,
      expenseView,
      expenseCreate,
      expenseEdit,
      expenseDelete,
      saleView,
      saleCreate,
      saleEdit,
      saleDelete,
      purchaseView,
      purchaseCreate,
      purchaseEdit,
      purchaseDelete,
      quotationView,
      quotationCreate,
      quotationEdit,
      quotationDelete,
      salesReturnView,
      salesReturnCreate,
      salesReturnEdit,
      salesReturnDelete,
      purchaseReturnView,
      purchaseReturnCreate,
      purchaseReturnEdit,
      purchaseReturnDelete,
      customerListView,
      customerListCreate,
      customerListEdit,
      customerListDelete,
      supplierListView,
      supplierListCreate,
      supplierListEdit,
      supplierListDelete,
      reportView,
      selectAllUsers,
      selectAllExpenses,
      selectAllSales,
      selectAllPurchases,
      selectAllQuotations,
      selectAllSalesReturn,
      selectAllPurchaseReturn,
      selectAllCustomerList,
      selectAllSupplierList
    } = req.body;
    const permissionsToEdit = await userModel.findById(id);
    if (!permissionsToEdit) {
      res.status(204).send({
        success: false,
        message: "permissions details not found!",
      });
    }
    await userModel.findByIdAndUpdate(id, {
      $set: {
        roleDescription,
        selectedPermissions: {
          selectAll,
          userView,
          userCreate,
          userEdit,
          userDelete,
          productView,
          productCreate,
          productEdit,
          productDelete,
          productBarcode,
          selectAllProducts,
          expenseView,
          expenseCreate,
          expenseEdit,
          expenseDelete,
          saleView,
          saleCreate,
          saleEdit,
          saleDelete,
          purchaseView,
          purchaseCreate,
          purchaseEdit,
          purchaseDelete,
          quotationView,
          quotationCreate,
          quotationEdit,
          quotationDelete,
          salesReturnView,
          salesReturnCreate,
          salesReturnEdit,
          salesReturnDelete,
          purchaseReturnView,
          purchaseReturnCreate,
          purchaseReturnEdit,
          purchaseReturnDelete,
          customerListView,
          customerListCreate,
          customerListEdit,
          customerListDelete,
          supplierListView,
          supplierListCreate,
          supplierListEdit,
          supplierListDelete,
          reportView,
          selectAllUsers,
          selectAllExpenses,
          selectAllSales,
          selectAllPurchases,
          selectAllQuotations,
          selectAllSalesReturn,
          selectAllPurchaseReturn,
          selectAllCustomerList,
          selectAllSupplierList
        },
      }
    })
    res.status(200).send({
      success: true,
      message: "Permissions details updated successfully!!",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid permissions details id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In EDIT PERMISSIONS API!!",
      error,
    });
  }
};

// delete group permissions //
export const deleteGroupPermissionsController = async (req, res) => {
  try {
    const id = req.params.id;
    const permissionsToDelete = await Permission.findById(id);
    if (!permissionsToDelete) {
      return res.status(404).send({
        success: false,
        message: "Permissions details not found!!",
      });
    }
    await permissionsToDelete.deleteOne();
    res.status(200).send({
      success: true,
      message: "Permissions details DELETED Successfully!!!",
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
      message: "ERROR IN DELETE PERMISSION DETAILS API!",
      error,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const id = req.body.userId;
    await userModel.findByIdAndUpdate(id, {
      $set: {
        status: false
      }
    });
    const user = await userModel.findById(id)
    console.log(user);
    res.status(200).send({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ERROR IN LOGOUT API!",
      error,
    });
  }
};

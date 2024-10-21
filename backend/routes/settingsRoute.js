import express from "express";
import {
  addIndividualCurrencyController,
  addIndividualTaxController,
  addPaymentSettingsController,
  deleteIndividualCurrencyController,
  deleteIndividualTaxController,
  editIndividualCurrencyController,
  editIndividualTaxController,
  editPaymentSettingsController,
  getCurrencySettingsController,
  getCurrencySettingsControllerById,
  getEmailSettingsController,
  getGeneralSettingsController,
  getGroupPermissionsController,
  getPaymentSettingsController,
  getPaymentSettingsControllerById,
  getTaxRateController,
  postGroupPermissionsController,
  updateEmailSettingsController,
  updateGeneralSettingsController,
  getGeneralSettingsControllerById,
  addEmailSettingsController,
  getEmailSettingsByIdController,
  getTaxRateControllerById,
  addGeneralSettingsController,
  getGroupPermissionsByIdController,
  deleteGroupPermissionsController,
  editGroupPermissionsController,
  logout,
} from "../controllers/settingsController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// GENERAL SETTINGS ROUTE //
router.get("/general-settings", getGeneralSettingsController);
router.get("/general-settings/:id", getGeneralSettingsControllerById);
router.post("/general-settings", addGeneralSettingsController);
router.put("/general-settings/:id", updateGeneralSettingsController);

// EMAIL SETTINGS ROUTE //
router.get("/get-email-settings", getEmailSettingsController);
router.get("/get-email-settings/:id", getEmailSettingsByIdController);
router.post("/add-email-settings", addEmailSettingsController);
router.put("/edit-email-settings/:id", updateEmailSettingsController);

// PAYMENT SETTINGS ROUTE //
router.get("/get-payment-settings", getPaymentSettingsController);
router.get("/get-payment-settings-by-id/:id", getPaymentSettingsControllerById);
router.post("/add-payment-settings", addPaymentSettingsController);
router.put("/edit-payment-settings/:id", editPaymentSettingsController);

// CURRENCY SETTINGS ROUTES //
router.get("/get-currency", getCurrencySettingsController);
router.get("/get-currency-by-id/:id", getCurrencySettingsControllerById);
router.post("/add-currency", addIndividualCurrencyController);
router.put("/edit-currency/:id", editIndividualCurrencyController);
router.delete("/delete-currency/:id", deleteIndividualCurrencyController);

// TAX SETTINGS ROUTES //
router.get("/taxrates", getTaxRateController);
router.get("/get-taxrates/:id", getTaxRateControllerById);
router.post("/taxrates", addIndividualTaxController);
router.put("/taxrates/:id", editIndividualTaxController);
router.delete("/taxrates/:id", deleteIndividualTaxController);

// GROUP PERMISSION ROUTES //
router.get("/grouppermissions", getGroupPermissionsController);
router.get("/grouppermissions/:id", getGroupPermissionsByIdController);
router.post("/grouppermissions", postGroupPermissionsController);
router.put("/grouppermissions/:id", editGroupPermissionsController);
router.delete("/grouppermissions/:id", deleteGroupPermissionsController);

// LOG OUT
router.put("/logout",userAuth, logout);

export default router;

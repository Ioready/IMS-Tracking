import express from "express";

import {
  getPurchase,
  addPurchase,
  editPurchase,
  deletePurchase,
  createReturnPurchase,
  getReturnPurchase,
  editReturnPurchase,
  deleteReturnPurchase,
  getPurchaseById,
  getPurchaseOrderList,
  getReturnPurchaseById,
  uploadCsv,
  addImportPurchase,
  getPurchaseReport,
} from "./../controllers/purchaseController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getPurchase);
router.get("/get-purchase-order-list", getPurchaseOrderList);
router.get("/get-purchase-report", getPurchaseReport);
router.get("/get-purchase-details/:id", getPurchaseById);
router.post("/add-purchase", addPurchase);
router.post('/upload-csv', upload.single('csvFile'), uploadCsv)
router.post('/add-import-purchase', addImportPurchase)
router.put("/edit-purchase/:id", editPurchase);
router.delete("/delete-purchase/:id", deletePurchase);

router.get("/return", getReturnPurchase);
router.get("/return/get-return-purchase-details/:id", getReturnPurchaseById);
router.post("/return/add-return", createReturnPurchase);
router.put("/return/edit-return/:id", editReturnPurchase);
router.delete("/return/delete-purchase/:id", deleteReturnPurchase);

export default router;

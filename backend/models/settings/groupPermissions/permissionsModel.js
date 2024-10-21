import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema({
  role: {
    type: String,
  },
  roleDescription: {
    type: String,
  },
  userManagement: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },

  userPermission: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },

  products: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },

  adjustment: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  transfer: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  expenses: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  sales: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  purchase: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  quotatations: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  salesReturn: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  purchaseReturn: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  paymentSales: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  paymentPurchase: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  paymentReturn: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  customerList: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  supplierList: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
  reports: {
    type: mongoose.Types.ObjectId,
    ref: "Task",
  },
});

const Permission = mongoose.model("Permission", permissionsSchema);
export default Permission;

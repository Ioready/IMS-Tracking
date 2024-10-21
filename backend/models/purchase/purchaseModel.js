import mongoose from "mongoose";
const Objectid = mongoose.Types.ObjectId;

const purchaseSchema = new mongoose.Schema({
  supplierName: {
    type: Objectid,
    ref: "suppliers",
  },
  purchaseDate: {
    type: Date,
  },
  productName: {
    type: Objectid,
    ref: "products",
  },
  referenceNumber: {
    type: String,
    default: "Reference not added",
    // required: [true, "Reference number is required"],
  },
  orderTax: {
    type: String,
    // required: true,
  },
  totalDiscount: {
    type: String,
    default: 0,
    // required: true,
  },
  shipping: {
    type: Number,
    default: 0,
    // required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Received"],
    default: "Pending",
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  grandTotalNumber: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    default: 0,
    // required: true
  },
  dueAmount: {
    type: Number,
    default: 0,
    // required: true,
  },
  payment_status: {
    type: String,
    default: "Paid",
    // required: true
  },
  paymentType: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  selectedData: {
    type: Array,
  },
});

const purchaseModel = mongoose.model("purchase", purchaseSchema);
export default purchaseModel;

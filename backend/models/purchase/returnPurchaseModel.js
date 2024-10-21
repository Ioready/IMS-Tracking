import mongoose from "mongoose";
const Objectid = mongoose.Types.ObjectId;

const returnPurchaseSchema = new mongoose.Schema({
  supplier: {
    type: Objectid,
    ref: "suppliers",
  },
  quotationDate: {
    type: Date,
    required: true,
  },
  referenceNumber: {
    type: String,
    required: [true, "Reference number is required"],
  },
  orderTax: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending","Orderded", "Received"],
    defualt: "Pending"
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  grandTotalNumber: {
    type: Number
  },
  paid: {
    type: Number,
    // required: true
  },
  dueAmount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    default: 'Paid'
    // required: true
  },
  selectedData: {
    type: Array
  }
});

const returnPurchaseModel = mongoose.model(
  "returnPurchase",
  returnPurchaseSchema
);
export default returnPurchaseModel;

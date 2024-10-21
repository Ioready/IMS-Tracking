import mongoose from "mongoose";
const Objectid = mongoose.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
    },
    category: {
      type: Objectid,
      ref: "categories",
    },
    subCategory: {
      type: Objectid,
      ref: "sub_categories",
    },
    brand: {
      type: Objectid,
      ref: "brands",
    },
    wareHouse: {
      type: Objectid,
      ref: "warehouses",
    },
    unit: {
      type: String,
      // required: true
    },
    sku: {
      type: String,
      // required: true
    },
    qty: {
      type: Number,
      // required: true
    },
    quantity: {
      type: Number,
      default: 1,
    },
    descr: {
      type: String,
      // required: true
    },
    tax: {
      type: String,
      // required: true
    },
    taxAmount: {
      type: Number,
      // required: true
    },
    discount: {
      type: String,
      // required: true
    },
    price: {
      type: Number,
      // required: true
    },
    status: {
      type: String,
      // required: true
    },
    image: {
      type: Array,
      // required: true
    },
    subTotal: {
      type: Number,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
    exist: {
      type: Boolean,
      default: false,
    },
    dateAdded: {
      type: Date,
      default: new Date()
    },
    expiryDate: {
      type: Date,
    },
    key: {
      type: Number
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
export default productModel;

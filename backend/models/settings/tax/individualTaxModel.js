import mongoose from "mongoose";

const IndividualTaxSchema = new mongoose.Schema({
  taxName: {
    type: String,
  },
  taxRate: {
    type: Number,
  },
  taxStatus: {
    type: Boolean,
    default: false
  },
});

const IndividualTax = mongoose.model("IndividualTax", IndividualTaxSchema);
export default IndividualTax;

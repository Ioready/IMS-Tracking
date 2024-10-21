import mongoose from "mongoose";

const TaxSchema = new mongoose.Schema({
  tax: [
    {
      type: mongoose.Types.ObjectId,
      ref: "IndividualTax",
    },
  ],
});

const Tax = mongoose.model("Tax", TaxSchema);
export default Tax;

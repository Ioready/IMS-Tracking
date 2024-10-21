import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  currency: [
    {
      type: mongoose.Types.ObjectId,
      ref: "IndividualCurrency",
    },
  ],
});

const Currency = mongoose.model("Currency", currencySchema);
export default Currency;

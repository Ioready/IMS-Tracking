import mongoose from "mongoose";

const IndividualCurrencySchema = new mongoose.Schema({
  currencyName: {
    type: String,
  },
  currencyCode: {
    type: String,
  },
  currencySymbol: {
    type: String,
  },
  currencyStatus: {
    type: Boolean,
    default: true
    // enum: ['Active', 'Inactive'],
  },
});

const IndividualCurrency = mongoose.model(
  "individualcurrencies",
  IndividualCurrencySchema
);
export default IndividualCurrency;

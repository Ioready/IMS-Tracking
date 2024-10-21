import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  paymentType: {
    type: String,
  },
  paymentStatus: {
    type: Boolean,
    default: true
  },
});

const PaymentSettings = mongoose.model(
  "PaymentSettings",
  paymentSettingsSchema
);
export default PaymentSettings;

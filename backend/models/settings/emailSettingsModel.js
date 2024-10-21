import mongoose from "mongoose";

const emailSettingsSchema = new mongoose.Schema({
  mailHost: {
    type: String,
  },
  mailPort: {
    type: String,
  },
  mailAddress: {
    type: String,
  },
  password: {
    type: String,
  },
  mailFromName: {
    type: String,
  },
  encryption: { type: String },
});

const emailSettingsModel = mongoose.model("emailSettings", emailSettingsSchema);
export default emailSettingsModel;

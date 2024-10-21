import mongoose from "mongoose";
// import { generalSettingsModel } from '.';
const Objectid = mongoose.Types.ObjectId;

const generalSettingsSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  timeZone: {
    type: String,
    enum: ["IST", "UST"],
    // required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "INR"],
    // required: true,
  },
  dateFormat: {
    type: String,
    // requrired: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  image: {
    type: Array,
  },
});

const GeneralSettings = mongoose.model(
  "GeneralSettings",
  generalSettingsSchema
);
export default GeneralSettings;

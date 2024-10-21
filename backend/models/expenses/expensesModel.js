import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
  expensesCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "expensesCategory",
    // type: String,
    // enum: [
    //   "employee benefit",
    //   "food and snacks",
    //   "entertainment",
    //   "office expenses and postage",
    //   "others",
    // ],
  },
  expensesDate: {
    type: Date,
    // required: true,
  },
  amount: {
    type: Number,
    // required: true,
  },

  // THIS REFERENCE ID NEEDS TO BE UNIQUE SO WORK NEEDS TO BE DONE LATER //

  referenceNumber: {
    type: String,
    // required: true,
    // unique: [
    //   true,
    //   "reference already exists, please try adding the new category",
    // ],
  },
  expensesFor: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
});

const expensesModel = mongoose.model("expenses", expensesSchema);
export default expensesModel;

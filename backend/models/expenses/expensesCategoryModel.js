import mongoose from "mongoose";

const expensesCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    // enum: [
    //   "employee benefit",
    //   "food and snacks",
    //   "entertainment",
    //   "office expenses and postage",
    //   "others",
    // ],
    // required: true,
    // unique: [true, "category already exists, please try adding new category"],
  },
  description: {
    type: String,
    // required: true,
  },
});

const expensesCategoryModel = mongoose.model(
  "expensesCategory",
  expensesCategorySchema
);
export default expensesCategoryModel;

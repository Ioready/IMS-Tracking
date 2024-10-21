import expensesCategoryModel from "../models/expenses/expensesCategoryModel.js";
import expensesModel from "../models/expenses/expensesModel.js";
// import returnPurchaseModel from "../models/purchase/returnPurchaseModel.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await expensesModel.find()
    .populate({
      path: "expensesCategory",
      select: "categoryName -_id"
    })
    const expense = expenses.map(expense => {
      // Convert the date format
      const formatDate = (dateString) => {
        const databaseDate = new Date(dateString);
        const day = databaseDate.getDate().toString().padStart(2, "0");
        const month = (databaseDate.getMonth() + 1).toString().padStart(2, "0");
        const year = databaseDate.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Map other properties
      return {
        ...expense._doc,
        expensesDate: formatDate(expense.expensesDate),
        categoryName: expense.expensesCategory ? expense.expensesCategory.categoryName : null
      };
    });
    res.status(200).send({
      success: true,
      message: "All expenses fetched successfully!!",
      expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get all expenses api!",
      error,
    });
  }
};

export const getExpensesById = async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await expensesModel.findById(id)
    // valdiation //
    res.status(200).send({
      success: true,
      message: "expense Found",
      expense,
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID not found //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In get expense by ID API",
      error,
    });
  }
};

export const addExpenses = async (req, res) => {
  try {
    const {
      expensesCategory,
      expensesDate,
      amount,
      referenceNumber,
      expensesFor,
      description,
    } = req.body;
    await expensesModel.create({
      expensesCategory,
      expensesDate,
      amount,
      referenceNumber,
      expensesFor,
      description,
    });
    res.status(201).send({
      success: true,
      message: "expenses added successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in expenses API!!",
      error,
    });
  }
};

export const editExpenses = async (req, res) => {
  // find the expense //
  try {
    const id = req.params.id; // this id is the reference number which has been created during addition of expenses //
    const expenses = await expensesModel.findById(id);
    if (!expenses) {
      return res.status(404).send({
        success: false,
        message: "expense record not found!",
      });
    }
    const { expensesCategory, expensesDate, amount, referenceNumber, expensesFor, description } =
      req.body;

    // check which one to update and update accordingly //
    if (expensesCategory) expenses.expensesCategory = expensesCategory;
    if (expensesDate) expenses.expensesDate = expensesDate;
    if (amount) expenses.amount = amount;
    if (referenceNumber) expenses.referenceNumber = referenceNumber;
    if (expensesFor) expenses.expensesFor = expensesFor;
    // if (orderTax) expenses.orderTax = orderTax;
    // if (discount) expenses.discount = discount;
    // if (shipping) expenses.shipping = shipping;
    // if (status) expenses.status = status;
    if (description) expenses.description = description;

    await expenses.save();
    res.status(200).send({
      success: true,
      message: "expenses details updated successfully",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid expense id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In UPDATE EXPENSES API!!",
      error,
    });
  }
};

export const deleteExpenses = async (req, res) => {
  try {
    // find the record of expense having the particular reference id //
    const id = req.params.id;
    await expensesModel.deleteOne({_id:id});
    res.status(200).send({
      success: true,
      message: "expense DELETED Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "INVALID ID/REFERENCE NUMBER",
      });
    }
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE EXPENSES API!",
      error,
    });
  }
};

export const getExpensesCat = async (req, res) => {
  try {
    const expensesCat = await expensesCategoryModel.find();
    // .populate("supplier")
    // .populate("referenceNumber")
    // .populate("status");
    // .populate("status")
    res.status(200).send({
      success: true,
      message: "All expenses categories fetched successfully!!",
      totalExpensesCategory: expensesCat.length,
      expensesCat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get expenses categories api!",
      error,
    });
  }
};

export const getExpensesCatById = async (req, res) => {
  try {
    const id = req.params.id
    const expensesCat = await expensesCategoryModel.findById(id)
    res.status(200).send({
      success: true,
      message: "expenses categories fetched successfully!!",
      totalExpensesCategory: expensesCat.length,
      expensesCat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get expenses categories api!",
      error,
    });
  }
};

export const addExpensesCat = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    
    // Check if categoryName is provided and not null or empty
    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    await expensesCategoryModel.create({
      categoryName,
      description
    });
    res.status(201).send({
      success: true,
      message: "Expense category added successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create expense category API!!",
      error,
    });
  }
};


export const editExpensesCat = async (req, res) => {
  // find the expense category//
  const id = req.params.id;
  console.log(req.body);
  try {
    const category = await expensesCategoryModel.findById(id);
  console.log(category);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "expense category not found!",
      });
    }
    const {categoryName, description} = req.body;

    // check which one to update and update accordingly //
    // if (expensesCategory) expenses.expensesCategory = expensesCategory;
    // if (expensesDate) expenses.expensesDate = expensesDate;
    // if (amount) expenses.amount = amount;
    // if (expensesFor) expenses.expensesFor = expensesFor;
    // if (orderTax) expenses.orderTax = orderTax;
    // if (discount) expenses.discount = discount;
    // if (shipping) expenses.shipping = shipping;
    // if (status) expenses.status = status;
    if (categoryName) category.categoryName = categoryName;
    if (description) category.description = description;

    await category.save();
    res.status(200).send({
      success: true,
      message: "expenses category details updated successfully",
    });
  } catch (error) {
    console.log(error);

    // cast error ||  OBJECT ID //
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid category id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In UPDATE EXPENSES API!!",
      error,
    });
  }
};

export const deleteExpensesCat = async (req, res) => {
  try {
    // find the record of expense having the particular reference id //
    const referenceId = req.params.id;
    const expenseCat = await expensesCategoryModel.findById(referenceId);
    // validation //
    if (!expenseCat) {
      return res.status(404).send({
        success: false,
        message: "expense category not found!!",
      });
    }

    await expenseCat.deleteOne();
    res.status(200).send({
      success: true,
      message: "expense DELETED Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "INVALID ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE EXPENSES CATEGORY API!",
      error,
    });
  }
};


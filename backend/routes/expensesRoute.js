import express from "express";
import {
  getExpenses,
  addExpenses,
  editExpenses,
  deleteExpenses,
  getExpensesCat,
  addExpensesCat,
  editExpensesCat,
  deleteExpensesCat,
  getExpensesCatById,
  getExpensesById,
} from "../controllers/expensesController.js";

const router = express.Router();

// EXPENSES ROUTE //
router.get("/", getExpenses);
router.get("/get-category-by-id/:id", getExpensesById);
router.post("/add-expenses", addExpenses);
router.put("/edit-expenses/:id", editExpenses);
router.delete("/delete-expenses/:id", deleteExpenses);

// EXPENSES CATEGORY ROUTES //
router.get("/get-expenses-category", getExpensesCat);
router.get("/get-expenses-category-by-id/:id", getExpensesCatById);
router.post("/add-expenses-category", addExpensesCat);
router.put("/edit-expenses-category/:id", editExpensesCat);
router.delete("/delete-expenses-category/:id", deleteExpensesCat);

export default router;

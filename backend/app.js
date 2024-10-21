/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connection from "./config/connection.js";
connection();

import mainRoute from "./routes/main.js";
import productRoute from "./routes/products.js";
import userRoute from "./routes/user.js";
import preopleRoute from "./routes/people.js";
import purchaseRoute from "./routes/purchaseRoute.js";
import expansesRoute from "./routes/expensesRoute.js";
import settingsRoute from "./routes/settingsRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/main", mainRoute);

app.use("/products", productRoute);
app.use("/peoples", preopleRoute);
app.use("/", userRoute);
app.use("/purchase", purchaseRoute);
app.use("/expenses", expansesRoute);
app.use("/settings", settingsRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started At Port ${port}`));

const express = require("express");
const booksRouter = require("./routes/books");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config()

mongoose.connect(process.env.DATABASE_URL);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/books", booksRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://127.0.0.1:${port}`);
});

const express = require("express");
const booksRouter = require("./routes/books");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/kindlebooks");
app.use("/books", booksRouter);

app.listen(3000, () => {
  console.log(`server started at http://127.0.0.1:3000`);
});

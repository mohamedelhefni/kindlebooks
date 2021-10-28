const express = require("express");
const Book = require("../models/books");
const router = express.Router();
const makePagination = require("../utils/pagination");

//dummy data for testing
const pagination = {
  pages: 1000,
  total: 1000,
  prev: 1000,
  currentPage: 1000,
  next: 1000,
};

router.get("/:page", makePagination(Book), async (_req, res) => {
  //const books = await Book.find().sort({ views: "desc" }).limit(100);
  //res.json({ books: books, pagination: pagination });
  res.json(res.paginatedResults);
});

router.get(
  "/search/:name/page/:page",
  makePagination(Book),
  async (_req, res) => {
    //const books = await Book.find({ $text: { $search: req.params.name } });
    //res.json({ books: books, pagination: pagination });
    res.json(res.paginatedResults);
  }
);

router.post("/download", async (req, res) => {
  const id = req.body.driveId;
  try {
    await Book.findOneAndUpdate(
      { driveId: id },
      { $inc: { downloaded: 1 } }
    ).exec();

    res.json({ msg: "downloaded successfully" });
  } catch (e) {
    res.json({ msg: "didn't updated succ" });
  }
});

module.exports = router;

function createPagination(page, limit, count) {
  const pagination = {};
  const pages = Math.ceil(count / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (endIndex < count) {
    pagination.next = +page + 1;
  }
  if (startIndex > 0) {
    pagination.prev = page - 1;
  }
  pagination.pages = pages;
  pagination.currentPage = page;
  pagination.total = count;
  return pagination;
}

function makePagination(model) {
  return async (req, res, next) => {
    const page = req.params.page;
    const limit = 30;
    const query = req.params.name;
    const startIndex = (page - 1) * limit;
    const results = {};
    const modelName = String(model.collection.collectionName).toLowerCase();
    try {
      if (query) {
        results[modelName] = await model
          .find({ $text: { $search: query } })
          .limit(limit)
          .skip(startIndex)
          .sort({ views: "desc" })
          .exec();
        const total = await model.find({ $text: { $search: query } }).count();
        results.pagination = createPagination(page, limit, total);
      } else {
        const docsCount = await model.countDocuments().exec();
        results[modelName] = await model
          .find()
          .limit(limit)
          .skip(startIndex)
          .sort({ views: "desc" })
          .exec();
        results.pagination = createPagination(page, limit, docsCount);
      }
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

module.exports = makePagination;

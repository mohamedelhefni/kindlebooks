const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  telegramId: {
    type: Number,
  },
  channelId: {
    type: Number,
  },
  driveId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  size: {
    type: Number,
  },
  views: {
    type: Number,
  },
  downloaded: {
    type: Number,
  },
});

module.exports = mongoose.model("Book", bookSchema);

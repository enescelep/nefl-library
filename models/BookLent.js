const mongoose = require('mongoose');

const BookLentSchema = new mongoose.Schema(
  {

    bookId: {
      type: mongoose.Schema.Types.ObjectId
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId
    },

    book: {
      type: Object,
      required: false,
    },

    student: {
      type: Object,
      required: false,
    },

    bookName: {
      type: String,
      required: false,
      default: ' ',
    },

    studentName: {
      type: String,
      required: false,
      default: ' ',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookLent', BookLentSchema);

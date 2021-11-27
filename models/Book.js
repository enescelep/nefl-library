const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: false,
      trim: true,
    },
    year: {
      type: Number,
      required: false,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: false,
    },
    categoryName: {
      type: String,
      default: 'Kategori ismi yuklenemedi.'
    },
    isbn: {
      type: String,
      required: false,
      trim: true,
    },
    borrowers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    ],
    borrowerNames: [
      {
        type: String,
        required: false,
        default: '',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);

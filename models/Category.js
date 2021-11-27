const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],

    bookNames: [
      {
        type: String,
        required: false,
        default: ' ',
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);

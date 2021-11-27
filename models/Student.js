const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const StudentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  borrowedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: false,
    },
  ],
  bookNames: [
    {
      type: String,
      required: false,
      default: ' '
    }
  ],
  schoolNumber: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Student", StudentSchema);

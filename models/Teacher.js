const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TeacherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  { timestamps: true }
);

TeacherSchema.pre('save', function (next) {
  const teacher = this;
  bcrypt.hash(teacher.password, 10, (error, hash) => {
    teacher.password = hash;
    next();
  });
});

module.exports = mongoose.model('Teacher', TeacherSchema);

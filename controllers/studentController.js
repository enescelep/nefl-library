const Student = require('../models/Student');
const Book = require('../models/Book');
const BookLent = require('../models/BookLent');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort('-updatedAt');
    res.render('students', {
      students,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/students');
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.redirect('/students');
  } catch (error) {
    console.log(error);
    res.redirect('/students');
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const oldSchoolNumber = student.schoolNumber;
    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;
    student.schoolNumber = req.body.schoolNumber;
    student.save();
    const books = await Book.find({ borrowers: student._id });
    books.forEach((book) => {
      book.borrowerNames = book.borrowerNames.filter((name) => {
        if (!name.includes(oldSchoolNumber)) {
          return name;
        }
      });
      book.borrowerNames.push(
        `${req.body.firstName} ${req.body.lastName} | ${req.body.schoolNumber}`
      );
      book.save();
    });

    const bookLents = await BookLent.find({ studentId: student._id });
    for (const bookLent of bookLents) {
      bookLent.studentName = `${req.body.firstName} ${req.body.lastName} | ${req.body.schoolNumber}`;
      bookLent.save();
    }
    res.redirect('/students');
  } catch (error) {
    console.log(error);
    res.redirect('/students');
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    for (const borrowedBook of student.borrowedBooks) {
      const book = await Book.findById(borrowedBook);
      book.borrowers.pull({ _id: student._id });
      console.log(book.borrowerNames);
      book.borrowerNames = book.borrowerNames.filter((name) => {
        if (!name.includes(student.schoolNumber)) {
          return name;
        }
      });
      const bookLents = await BookLent.deleteMany({
        bookIsbn: book.isbn,
        studentId: student._id,
        bookId: book._id,
      });

      book.save();
    }
    res.redirect('/students');
  } catch (error) {
    console.log(error);
    res.redirect('/students');
  }
};

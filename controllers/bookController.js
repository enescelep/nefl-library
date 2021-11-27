const Book = require('../models/Book');
const Category = require('../models/Category');
const Student = require('../models/Student');
const BookLent = require('../models/BookLent');

exports.createBook = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    const categoryName = category.name;

    const book = await Book.create({
      name: req.body.name,
      author: req.body.author,
      year: req.body.year,
      isbn: req.body.isbn,
      category: req.body.category,
      categoryName,
    });

    category.books.push({ _id: book._id });
    category.bookNames.push(`${book.name} | ${book.author}`);
    category.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
};

exports.updateBook = async (req, res) => {
  try {
    const oldBook = await Book.findById(req.params.id);
    const book = await Book.findById(req.params.id);
    if (book.category !== req.body.category) {
      if (book.category !== null) {
        const oldCategory = await Category.findById(book.category);
        oldCategory.books.pull({ _id: book._id });
        oldCategory.bookNames = oldCategory.bookNames.filter((bookName) => {
          if (
            !(bookName.includes(book.name) && bookName.includes(book.author))
          ) {
            return bookName;
          }
        });
        oldCategory.save();
      }

      const newCategory = await Category.findById(req.body.category);
      newCategory.books.push({ _id: book._id });
      newCategory.bookNames.push(`${req.body.name} | ${req.body.author}`);
      newCategory.save();

      book.name = req.body.name;
      book.author = req.body.author;
      book.year = req.body.year;
      book.isbn = req.body.isbn;
      book.category = newCategory._id;
      book.categoryName = newCategory.name;
    }
    if (book.borrowers.length > 0) {
      for (const borrower of book.borrowers) {
        const bookLent = await BookLent.findOne({ studentId: borrower });
        const student = await Student.findById(borrower);
        bookLent.bookName = req.body.name;
        bookLent.author = req.body.author;
        bookLent.save();
        student.bookNames = student.bookNames.filter((bookName) => {
          if (
            !(
              bookName.includes(oldBook.author) &&
              bookName.includes(oldBook.name)
            )
          ) {
            return bookName;
          }
        });
        student.bookNames.push(`${book.name} | ${book.author}`);
        student.save();
      }
    }
    book.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.returnBook = async (req, res) => {
  try {
    const bookLent = await BookLent.findByIdAndDelete(req.body.bookLent);
    const book = await Book.findOne({ _id: bookLent.bookId });
    const student = await Student.findOne({ _id: bookLent.studentId });
    book.borrowers.pull({ _id: student._id });
    book.borrowerNames = book.borrowerNames.filter((name) => {
      if (!name.includes(student.schoolNumber)) {
        return name;
      }
    });

    student.borrowedBooks.pull({ _id: book._id });
    student.bookNames = student.bookNames.filter((bookName) => {
      if (!(bookName.includes(book.name) && bookName.includes(book.author))) {
        return bookName;
      }
    });

    book.save();
    student.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
};

exports.lendBook = async (req, res) => {
  try {
    const student = await Student.findById(req.body.student);
    const book = await Book.findById(req.body.book);

    student.borrowedBooks.push({ _id: req.body.book });
    student.bookNames.push(`${book.name} | ${book.author}`);
    student.save();

    book.borrowers.push({ _id: req.body.student });
    const studentInfo = `${student.firstName} ${student.lastName} | ${student.schoolNumber}`;
    book.borrowerNames.push(studentInfo);
    book.save();

    await BookLent.create({
      book: book,
      student: student,
      bookId: book._id,
      studentId: student._id,
      bookName: book.name,
      studentName: studentInfo,
    });

    res.status(200).redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const category = await Category.findById(book.category);
    if (category) {
      category.books.pull({ _id: book._id });
      console.log(category.bookNames);
      category.bookNames = category.bookNames.filter((bookName) => {
        if (!(bookName.includes(book.name) && bookName.includes(book.author))) {
          return bookName;
        }
      });
      console.log(category.bookNames);
      category.save();
    }

    const studentsBorrowed = await Student.find({ borrowedBooks: book._id });
    for (let studentBorrowed of studentsBorrowed) {
      await studentBorrowed.borrowedBooks.pull({ _id: book._id });
      const bookLent = await BookLent.deleteMany({
        bookIsbn: book.isbn,
        studentId: studentBorrowed._id,
        bookId: book._id,
      });
      console.log(bookLent);
      studentBorrowed.bookNames = studentBorrowed.bookNames.filter(
        (bookName) => {
          if (
            !(bookName.includes(book.name) && bookName.includes(book.author))
          ) {
            return bookName;
          }
        }
      );
      studentBorrowed.save();
    }

    await Book.findByIdAndDelete(book._id);
    res.status(200).redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).redirect('/');
  }
};
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort('-updatedAt');
    const categories = await Category.find({}).sort('-updatedAt');
    const students = await Student.find({}).sort('-updatedAt');
    const booksLent = await BookLent.find({}).sort('-updatedAt');

    res.render('books', {
      books,
      categories,
      students,
      booksLent,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
};

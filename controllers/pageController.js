const Book = require('../models/Book');
const Category = require('../models/Category');

exports.getIndexPage = async (req, res) => {
  const books = await Book.find({}).sort('-updatedAt');
  const categories = await Category.find({}).sort('-updatedAt');

  if (req.session.teacherID) {
    res.status(200).render('index', {
      books,
      categories,
    });
  } else {
    res.render('sign-in');
  }
};

exports.getRegisterPage = (req, res) => {
  console.log('Register');
  res.status(200).render('register');
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('sign-in');
};

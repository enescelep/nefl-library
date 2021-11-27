const Category = require('../models/Category');
const Book = require('../models/Book');

exports.createCategory = async (req, res) => {
  try {
    await Category.create(req.body);
    res.status(201).redirect('/categories');
  } catch (error) {
    console.log(error);
    res.redirect('/categories');
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('-updatedAt');
    res.status(200).render('categories', { categories });
  } catch (error) {
    console.log(error);
    res.redirect('/categories');
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    category.name = req.body.name;
    category.save();

    const books = await Book.find({ category: req.params.id });
    console.log(books);
    for (const book of books) {
      book.categoryName = category.name;
      book.save();
    }

    res.redirect('/categories');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    for (const categoryBook of category.books) {
      const book = await Book.findById(categoryBook);
      book.category = null;
      book.categoryName = 'Kategori adi bulunamadi.';
      book.save();
    }
    res.redirect('/categories');
  } catch (error) {
    res.redirect('/categories');
  }
};

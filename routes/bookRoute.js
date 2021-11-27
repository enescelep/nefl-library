const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.route('/add').post(bookController.createBook);
router.route('/').get(bookController.getAllBooks);
router.route('/update/:id').put(bookController.updateBook);
router.route('/delete/:id').delete(bookController.deleteBook);
router.route('/lendBook').post(bookController.lendBook);
router.route('/returnBook').post(bookController.returnBook);

module.exports = router;

const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.route('/').get(categoryController.getAllCategories);
router.route('/add').post(categoryController.createCategory);
router.route('/update/:id').put(categoryController.updateCategory);
router.route('/delete/:id').delete(categoryController.deleteCategory);

module.exports = router;

const router = require('express').Router();
const studentController = require('../controllers/studentController');

router.route('/').get(studentController.getAllStudents);
router.route('/add').post(studentController.createStudent);
router.route('/update/:id').put(studentController.updateStudent);
router.route('/delete/:id').delete(studentController.deleteStudent);

module.exports = router;
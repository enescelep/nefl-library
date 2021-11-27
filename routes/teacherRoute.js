const router = require('express').Router();
const authController = require('../controllers/authController');

router.route('/register').post(authController.createTeacher);
router.route('/sign-in').post(authController.loginTeacher);
router.route('/logout').get(authController.logoutTeacher);

module.exports = router;

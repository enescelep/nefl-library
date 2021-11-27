const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');

exports.createTeacher = async (req, res) => {
  try {
    const teacher = Teacher.create(req.body);
    console.log(`Bir ogretmen kayit oldu`);
    res.status(201).redirect('/sign-in');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.error,
    });
  }
};

exports.loginTeacher = (req, res) => {
  try {
    const { username, password } = req.body;
    Teacher.findOne({ username }, (err, teacher) => {
      if (teacher) {
        bcrypt.compare(password, teacher.password, (err, same) => {
          if (same) {
            // Session
            console.log(`${teacher.name} adli ogretmen giris yapti`);
            req.session.teacherID = teacher._id;
            res.status(200).redirect('/');
          }
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutTeacher = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};

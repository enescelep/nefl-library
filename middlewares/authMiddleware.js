const Teacher = require('../models/Teacher');

module.exports = (req, res, next) => {
  Teacher.findById(req.session.teacherID, (err, teacher) => {
    if (err || !user) return res.redirect('/login');
    next();
    })
}
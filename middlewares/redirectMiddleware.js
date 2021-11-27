module.exports = (req, res, next) => {
  if (req.session.teacherID) {
    return res.redirect('/');
  }
  next();
}
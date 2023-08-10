const bcrypt = require('bcryptjs');
const SameEmailError = require('../errors/same-email-err');
const User = require('../models/user');

const register = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(req.body.password, 10)
          .then((hash) => User.create({
            email: req.body.email,
            password: hash,
          }))
          .then((userData) => res.status(201).send({
            _id: userData._id,
            email: userData.email,
          }))

          .catch(next);
      }
      throw new SameEmailError('Пользователь с таким email уже существует');
    })
    .catch(next);
};

module.exports = register;

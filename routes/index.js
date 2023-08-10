const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./users');
const auth = require('../middlewares/auth');
const login = require('../controllers/login');
const register = require('../controllers/register');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required().min(8),
    }),
  }),
  register,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

router.use('/users', auth, usersRoutes);
router.use(/\//, auth);

module.exports = router;

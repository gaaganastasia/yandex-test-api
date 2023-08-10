const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const controller = require('../controllers/users');

router.get('/', controller.getUsers);

module.exports = router;

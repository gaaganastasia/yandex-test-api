const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
const { centarlErrors } = require('./middlewares/central-errors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes/index.js');

const bcrypt = require('bcryptjs');

const { PORT = 3001 } = process.env;
const app = express();

const allowedCors = [
  'https://yandex-test.vercel.app',
  'http://yandex-test.vercel.app',
  'http://localhost:3000'
];

mongoose.connect('mongodb+srv://ndthwm:EjE8M8tlenBg4k6l@cluster0.2fcrwu7.mongodb.net/?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
})
  .then(() => console.log('mongo connected'))
  .catch((err) => {console.log(err)});

app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use('/', routers);
app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());
app.use(centarlErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});

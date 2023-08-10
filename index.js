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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://yandex-test.vercel.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === 'POST' && req.url === '/signup') {
    // let data = [];

    // req.on('data', chunk => {
    //   data.push(chunk);
    // });

    // req.on('end', () => {
    //   const body = Buffer.concat(data).toString();
    //   const { name } = JSON.parse(body);

      res.setHeader('Access-Control-Allow-Origin', 'https://yandex-test.vercel.app');
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      // res.writeHead(200, { 'Content-Type': 'text/plain' });
      // res.end(`Hello, ${name}!`);
  //   });
  // } else {
  //   res.statusCode = 404;
  //   res.end();
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

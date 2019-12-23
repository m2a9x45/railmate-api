/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3060;
const hostname = require('os').hostname();
const cors = require('cors');
require('dotenv').config();

const appRoute = require('./routes/app.js');
const userRoute = require('./routes/user.js');
const metricsRoute = require('./routes/metrics.js');
const db = require('./db/conn.js');

const corsOptions = {
  origin: ['http://railmate.net', 'http://dev.railmate.net', 'http://127.0.0.1:8080'],
  optionsSuccessStatus: 200,
};

const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10,
});

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static('public'));

app.use('/app', appRoute);
app.use('/user', apiLimiter, userRoute);
app.use('/metrics', metricsRoute.router);

db.authenticate()
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  metricsRoute.counter.inc({ route: '/' });
  res.json({
    host: 'localhost',
    name: 'Railamte api',
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}! Link : http://${hostname}:${port}/`));

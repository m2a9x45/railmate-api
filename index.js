/* eslint-disable no-console */
const express = require('express');

const app = express();
const port = 3000;
const hostname = require('os').hostname();
const cors = require('cors');
require('dotenv').config();

const appRoute = require('./routes/app.js');
const userRoute = require('./routes/user.js');
const db = require('./db/conn.js');

const corsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static('public'));

app.use('/app', appRoute);
app.use('/user', userRoute);


db.authenticate()
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.json({
    About: 'Documention for how to use the railmate API',
    Endpoints: [
      {
        name: 'app/stations',
        link: `http://${hostname}:${port}/app/stations`,
        type: 'GET',
        description: 'Gets all stations in the uk',
      },
      {
        name: 'app/livedepatures/[STATION_CODE]',
        link: `http://${hostname}:${port}/app/livedepatures/KGX`,
        type: 'GET',
        description: "Gets all the depatures for a station based on it's station code",
      },
      {
        name: 'app/operator/[OPERATORID]/[DEVMODE]',
        link: `http://${hostname}:${port}/app/operator/TL/true`,
        type: 'GET',
        description: 'Gets the live or test img url of the train operator',
      },
      {
        name: 'user/getInterest',
        link: `http://${hostname}:${port}/user/getinterest`,
        type: 'GET',
        description: 'Gets all users how have registered for the app online',
      },
      {
        name: 'user/interest/download/[OS]/[ID]',
        link: `http://${hostname}:${port}/user/getinterest`,
        type: 'GET',
        description: 'Gets the app files for download',
      },
      {
        name: 'user/interest',
        link: `http://${hostname}:${port}/user/interest`,
        type: 'POST',
        description: 'Adds a new user to the DB',
        data: {
          name: '[NAME]',
          email: '[EMAIL]',
          os: '[ANDROID/IOS]',
        },
      },
    ],
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}! Link : http://${hostname}:${port}/`));

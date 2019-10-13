const express = require('express');
const fetch = require('node-fetch');
const stationsJson = require('../data/stations.json');
const logoData = require('../data/logo.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Hi',
  });
});

// Gets all stations in the uk
router.get('/stations', (req, res) => res.json(stationsJson));

// Gets all the depatures for a station based on it's station code
router.get('/livedepatures/:code', (req, res) => {
  // console.log('Hit');

  const stationcode = req.params.code;

  const appID = process.env.APPID;
  const { API_KEY } = process.env;
  const url = `https://transportapi.com/v3/uk/train/station/${stationcode}/live.json?app_id=${appID}&app_key=${API_KEY}&darwin=false&train_status=passenger`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => res.json(json));

  // res.json(liveDepDate);
});

// Gets the live or test img url of the train operator
router.get('/operator/:id/:dev', (req, res) => {
  const { id } = req.params;
  const { dev } = req.params;

  // console.log('operator code :', id, 'devMode', dev);
  // console.log(logoData[0]);

  for (let i = 0; i < logoData.length; i++) {
    if (Array.isArray(logoData[i].operator_code)) {
      logoData[i].operator_code.forEach((element) => {
        if (id === element) {
          // console.log(logoData[i]);
          res.json({
            img_url: (dev === 'true') ? logoData[i].dev_img_url : logoData[i].img_url,
          });
        }
      });
    } else if (logoData[i].operator_code === id) {
      // console.log(logoData[i]);
      res.json({
        img_url: (dev === 'true') ? logoData[i].dev_img_url : logoData[i].img_url,
      });
    }
  }
});

module.exports = router;

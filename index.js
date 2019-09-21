const express = require('express')
const fetch = require('node-fetch');
require('dotenv').config()
const app = express()
const port = 3000
const hostname = require('os').hostname();

const stationsJson =  require('./data/stations.json');
const liveDepDate = require('./data/KGX.json');
const logoData = require('./data/logo.json');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({
        "About" : "Documention for how to use the railmate API",
        "Endpoints" : [
            {
                "name" : "/stations",
                "link" : `http://${hostname}:${port}/stations`,
                "type" : "GET",
                "description" : "Gets all stations in the uk"
            },
            {
                "name" : "/livedepatures/[STATION_CODE]",
                "link" : `http://${hostname}:${port}/livedepatures/KGX`,
                "type" : "GET",
                "description" : "Gets all the depatures for a station based on it's station code"
            },
            {
                "name" : "/operator/[operatorID]/[devMode]",
                "link" : `http://${hostname}:${port}/operator/TL/true`,
                "type" : "GET",
                "description" : "Gets the live or test img url of the train operator"
            }
        ]
    })
})

// Gets all stations in the uk
app.get('/stations', (req, res) => res.json(stationsJson))

// Gets all the depatures for a station based on it's station code
app.get('/livedepatures/:code', (req, res) => {
    console.log("Hit");

    const stationcode = req.params.code;

    const appID = process.env.APPID;
    const API_KEY = process.env.API_KEY
    const url = `https://transportapi.com/v3/uk/train/station/${stationcode}/live.json?app_id=${appID}&app_key=${API_KEY}&darwin=false&train_status=passenger`;

    fetch(url)
    .then(response => response.json())
    .then(json => res.json(json));

    // res.json(liveDepDate);
});

app.get('/operator/:id/:dev', (req, res) => {
    const id = req.params.id;
    const dev = req.params.dev;

    console.log("operator code :", id, "devMode", dev );
    // console.log(logoData[0]);

    for (let i = 0; i < logoData.length; i++) {
        if (Array.isArray(logoData[i].operator_code)) {
            logoData[i].operator_code.forEach(element => {
                if (id == element) {
                    console.log(logoData[i]); 
                    res.json({
                        "img_url" : (dev == "true") ? logoData[i].dev_img_url : logoData[i].img_url
                    })
                }
            });
        } else if (logoData[i].operator_code == id){
            console.log(logoData[i]);
            res.json({
                "img_url" : (dev == "true") ? logoData[i].dev_img_url : logoData[i].img_url
            });
        }       
    };
});



app.listen(port, () => console.log(`Example app listening on port ${port}! Link : http://${hostname}:${port}/`))




const express = require('express')
const fetch = require('node-fetch');
require('dotenv').config()
const app = express()
const port = 3000
const hostname = require('os').hostname();

const stationsJson =  require('./data/stations.json')

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
});



app.listen(port, () => console.log(`Example app listening on port ${port}! Link : http://${hostname}:${port}/`))




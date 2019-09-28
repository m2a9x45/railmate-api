const express = require('express')
require('dotenv').config()
const app = express()
const port = 3000
const hostname = require('os').hostname();

const appRoute = require('./routes/app.js')

app.use(express.static('public'));
app.use('/app', appRoute);

app.get('/', (req, res) => {
    res.json({
        "About" : "Documention for how to use the railmate API",
        "Endpoints" : [
            {
                "name" : "app/stations",
                "link" : `http://${hostname}:${port}/app/stations`,
                "type" : "GET",
                "description" : "Gets all stations in the uk"
            },
            {
                "name" : "app/livedepatures/[STATION_CODE]",
                "link" : `http://${hostname}:${port}/app/livedepatures/KGX`,
                "type" : "GET",
                "description" : "Gets all the depatures for a station based on it's station code"
            },
            {
                "name" : "app/operator/[OPERATORID]/[DEVMODE]",
                "link" : `http://${hostname}:${port}/app/operator/TL/true`,
                "type" : "GET",
                "description" : "Gets the live or test img url of the train operator"
            }
        ]
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}! Link : http://${hostname}:${port}/`))




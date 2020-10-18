const express = require('express');
const login = require('./login');
const bodyParser = require('body-parser');
const fs = require('fs');
const { response } = require('express');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
})

app.post('/getcal', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var parsed = await login(username, password);
    var uwData = parsed[0];
    var icsPath = parsed[1][0];
    var icsID = parsed[1][1];
    // var icsFilePath = processZoomEntries(calLink[1], calLink[0])
    // var icsFilePath = __dirname + "/testCal.ics";
    res.json( {
        link: 'http://localhost:3001/getcal/' + icsID
    })
})

app.get('/getcal/:id', (req, res) => {
    var id = req.params.id;
    var servePath = __dirname + "/serve/" + id + ".ics";
    res.download(servePath, 'zoomcalendar.ics', err => {
        console.log(err);
    })
})

app.listen(3001, () => {
    console.log("server started on port 3001");
})


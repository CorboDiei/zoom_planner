const express = require('express');
const login = require('./login');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const processZoomEntries = require('./UserDataParser');

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true}))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
})

app.post('/getcal', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log("trying to log in with " + username)
    try {
        var parsed = await login(username, password);
    } catch(e) {
        res.sendStatus(500);
    }
    var uwData = parsed[0];
    var icsPath = parsed[1][0];
    var icsID = parsed[1][1];
    setTimeout(() => {
        processZoomEntries(__dirname + "\\" + icsPath, uwData);
        res.statusCode = 200;
        res.json( {
            link: 'http://localhost:3001/getcal/' + icsID
    })
    }, 8000)
})

app.get('/getcal/:id', (req, res) => {
    var id = req.params.id;
    var servePath = __dirname + "/serve/" + id + "2.ics";
    res.download(servePath, 'zoomcalendar.ics', err => {
        console.log(err);
    })
})

app.listen(3001, () => {
    console.log("server started on port 3001");
})


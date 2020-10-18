const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login-submit', (req, res) => {
    return res.render('login-submit');
})

app.listen(3000, () => console.log("Server running on port 3000."));
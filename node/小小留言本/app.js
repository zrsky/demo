const express = require('express');
const app = express();
const db = require("./models/db");
const formidable = require('formidable');

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', function(req, res) {
    res.render('index')
})

app.post('/liuyan', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        res.json(fields)
    })
})

app.listen(3000) 
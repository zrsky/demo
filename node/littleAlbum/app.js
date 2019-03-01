const express = require('express');
const app = express();
const router = require('./controller')
const db = require('./models/db')

app.set('view engine', 'ejs');
//静态页面
app.use(express.static("./public"));

app.get('/find', function(req, res) {
    let page = req.query.page;
    db.find('student', {}, {pageSize: 2, pageNo: page}, function(err, result) {
        if(err) {
            res.send(err);
            return;
        }
        // console.log(result)
        res.send(result)
    })
})

app.get('/insert', function(req, res) {
    db.insertOne('student', {name: 'ads'}, function(err, result) {
        if(err) {
            res.send(err);
            return;
        }
        // console.log(result)
        res.send(result)
    })
})

app.get('/delete', function(req, res) {
    let name = req.query.name;
    db.deleteMany('student', {name: name}, function(err, result) {
        if(err) {
            res.send(err);
            return;
        }
        res.send(result);
    })
})

app.get('/update', function(req, res) {
    let name = req.query.name,
        newName = req.query.newName;
    db.updateMany('student', {name: name}, {$set: {name: newName}}, function(err, result) {
        if(err) {
            res.send(err);
            return;
        }
        res.send(result);
    })
})
app.get('/', router.showIndex);

app.listen(3000)

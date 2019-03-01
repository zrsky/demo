const files = require('../models/file.js');

exports.showIndex = function(req, res) {
    files.filesNameArr(function(err, filesNameArr) {
        if(err) {
            res.send(err);
            return;
        }
        res.render('index', {
            albums: filesNameArr
        })
    });
    
}
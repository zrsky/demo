const fs = require('fs');

let filesNameArr = [];
exports.filesNameArr = function(callback) {
    fs.readdir('./uploads', function(err, files) {
        if(err) {
            callback(err, null);
        }
        console.log(files.length);
        (function iterator(i) {
            if(i == files.length) {
                return callback(null, filesNameArr);
            }
            fs.stat('./uploads/' + files[i], function(err, stats) {
                if(err) {
                    callback('找不到文件' + files[i], null)
                }
                if(stats.isDirectory()) {
                    filesNameArr.push(files[i]);
                }
                i++;
                iterator(i);
            })
        })(0)
    })
}
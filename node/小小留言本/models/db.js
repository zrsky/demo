var MongoClient = require('mongodb').MongoClient;


function _connectDB(callback) {
    var url = 'mongodb://localhost:27017';
    MongoClient.connect(url, function(err, db) {
        const zr = db.db('zr');
        callback(err, zr, db);
    })
}

// 插入数据

exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, zr, db) {
        if(err) {
            callback(err, null);
            return
        }
        console.log('链接数据库成功')
        zr.collection(collectionName).insertOne(json, function (err, result) {
            if(err) {
                callback(err, null);
            }
            callback(null, result);
            db.close(); //关闭数据库
        })
    })
};


//查找数据

exports.find = function(collectionName, json, C, D) {
    let result = [];
    let length = arguments.length;
    let callback, args, limitNumber, skipNumber;
    if(length === 3) {
        callback = C;
        limitNumber = 0;
        skipNumber = 0;
    }else if(length === 4) {
        args = C;
        callback = D;
        limitNumber = args.pageSize;
        skipNumber = args.pageSize * (args.pageNo - 1);
    }
    _connectDB(function(err,zr, db) {
        if(err) {
            callback(err, null);
            return;
        }
       var cursor = zr.collection(collectionName).find(json).limit(limitNumber).skip(skipNumber);
       cursor.each(function(err, doc) {
           if(doc != null) {
               result.push(doc)
           } else {
               callback(null, result);
               db.close(); //关闭数据库
           }
       })
    })

}

//删除
exports.deleteMany = function(collectionName, json, callback) {
    _connectDB(function(err, zr, db) {
        if(err) {
            callback(err, null);
            return
        }

        zr.collection(collectionName).deleteMany(json, function(err, result) {
            if(err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        })
    })
}


//更改
exports.updateMany = function(collectionName, json1, json2, callback) {
    _connectDB(function(err, zr, db) {
        if(err) {
            callback(err, null);
            return;
        }

        zr.collection(collectionName).updateMany(json1, json2, function(err, result) {
            if(err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        })
    })
}

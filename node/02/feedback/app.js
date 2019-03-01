var http = require('http')
var fs = require('fs')

http.createServer((req, res) => {
   if(req.url === '/') {
       fs.readFile('./views/index.html', (err, data) => {
           if(err) {
               throw new Error(err);
           }
           res.end(data);
       })
   } else if (req.url.indexOf('/public/') === 0) {
       fs.readFile('.' + req.url, (err, data) => {
        if(err) {
            throw new Error(err);
        }
        
        res.end(data);
       })
   } 
}).listen(3000, (err) => {
    if(err) {
        console.log(err)
        return
    }
    console.log('成功开启3000端口');
})
const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    http.get('http://www.newsyuelu.com', (resp) => {
        //数据到达事件
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            try {
                res.end(data); //数据传输结束
            } catch(e) {
                resp.end(e.message)
            }
        })
    })

      
}).listen(3000)
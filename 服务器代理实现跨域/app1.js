const express = require('express');
const app = express();
const proxy = require('http-proxy-middleware');

app.use('/', proxy({
        target: 'httpw://ww.newsyuelu.com',
        changeOrigin: true,
        pathRewrite: {
            '^/': ''
        }
    }
))

app.listen(3000)
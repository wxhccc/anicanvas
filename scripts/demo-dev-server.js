const Koa = require('koa');
const static = require('koa-static');
const app = new Koa();

let staticRoot = __dirname + './../demo/';
app.use(static(staticRoot));

app.listen(3000);
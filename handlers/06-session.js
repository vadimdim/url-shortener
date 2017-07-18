const session = require('koa-generic-session');
const convert = require('koa-convert');

exports.init = app => app.use(convert(session({
  cookie: {
    signed: false
  }
})));

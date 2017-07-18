const serve = require('koa-static');

exports.init = app => app.use(serve('assets'));

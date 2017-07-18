const pug = require('pug');

exports.init = app => app.use(async (ctx, next) => {
  ctx.render = function(templatePath, locals) {
    return pug.renderFile(templatePath, locals);
  };

  await next();
});

const Koa = require('koa');
const app = new Koa();

const config = require('config');

const Promise = require("bluebird");
const path = require('path');
const fs = require('fs');
const db = Promise.promisifyAll(require('redis').createClient(process.env.REDIS_URL));

const getRandString = require("./libs/stringGenerator.js");
const checkUrl = require("./libs/checkUrl.js");

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));


const Router = require('koa-router');
const router = new Router();


router.get("/:short", async function(ctx) {

    let url = await db.getAsync(String(ctx.params.short));
    if(url !== null){
        ctx.redirect(url);
    }else{
        ctx.body = ctx.render('./templates/index.pug');
    }

});
router.post("/api/shortUrl", async function(ctx) {

    let shortUrl = ctx.request.body.shortUrl;
    let fullUrl = ctx.request.body.fullUrl;

    let fullUrlStatus = await checkUrl(fullUrl);
    console.log('fullUrlStatus',fullUrlStatus);

    if(fullUrlStatus>=400){
        ctx.status = fullUrlStatus;
        return ctx.body = "Original URL is invalid";
    }

    if(!shortUrl || fullUrl.length<0){
        shortUrl = getRandString(5);
    }

    let url = await db.getAsync(String(shortUrl));
    console.log('url',url);
    console.log('ctx.params.short',ctx.params.short);

    if(url !== null){
        ctx.status = 403;
        return ctx.body = "Short URL already exist";
    }

    db.set(shortUrl,fullUrl,'EX', 60*60*24*15);
    ctx.body = {
        shortUrl: shortUrl,
        successMsg: 'Short URL successfully created'
    };

});

router.get(/^\/(?!.*api).*/, async function(ctx) {
    ctx.body = ctx.render('./templates/index.pug');
});

app.use(router.routes());
console.log('started');

var port = process.env.PORT || config.get('port');
app.listen(port, function() {
    console.log('Listening on ' + port);
});
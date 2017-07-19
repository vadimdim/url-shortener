const Koa = require('koa');
const app = new Koa();

const config = require('config');

const Promise = require("bluebird");
const path = require('path');
const fs = require('fs');
const db = Promise.promisifyAll(require('redis').createClient(process.env.REDIS_URL));

//подключение кастомных решений
//функция генератор случайной строки длиной n
const getRandString = require("./libs/stringGenerator.js");
//функция проверки валидности url, возвращающая статус код
const checkUrl = require("./libs/checkUrl.js");

//базовые middlewares
//находятся в папке handlers, производится чтениее ее содержимого, сортировка по именам, для соблюдения порядка линкования
const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));

const Router = require('koa-router');
const router = new Router();

//обработка запроса на короткий урл
router.get("/:short", async function(ctx) {

    //получение origin url из базы данных
    let url = await db.getAsync(String(ctx.params.short));
    if(url !== null){
        //если url найден, произведение редиректа
        ctx.redirect(url);
    }else{
        //url не найден, возвращение клиенту главной страницы
        ctx.body = ctx.render('./templates/index.pug');
    }

});
//обработка запроса на добавление короткого урла
router.post("/api/shortUrl", async function(ctx) {

    //получение исходных данных
    //сформированны в request.body, middleware bodyParser
    let shortUrl = ctx.request.body.shortUrl;
    let fullUrl = ctx.request.body.fullUrl;

    //валидация полученного исходного url
    let fullUrlStatus = await checkUrl(fullUrl);

    if(fullUrlStatus>=400){
        //статус ошибки, уведомление клиента
        ctx.status = fullUrlStatus;
        return ctx.body = "Original URL is invalid";
    }

    if(!shortUrl || fullUrl.length<0){
        //короткое обозначение url не введено
        //генерирование короткого обозначения
        shortUrl = getRandString(5);
    }

    //проверка на наличие в бд короткого обазначения
    let url = await db.getAsync(String(shortUrl));

    if(url !== null){
        //короткое обозначение уже используется
        ctx.status = 403;
        return ctx.body = "Short URL already exist";
    }

    //добавление в базу пары {shortUrl:fullUrl}
    //{короткое обозначение: полный url}
    //устанавливается время жизни записи - 15 дней
    db.set(shortUrl,fullUrl,'EX', 60*60*24*15);

    //формирования ответа клиенту
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
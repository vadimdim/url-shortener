const http = require('http');
const https = require('https');

module.exports = function(url) {
    return new Promise( function(resolve, reject) {

        if(url.indexOf('https://') !== -1){
            https.get(url,  function(res) {
                resolve(res.statusCode);
            })
                .on('error', function(err){
                    resolve(404);
                });

        }else{
            http.get(url,  function(res) {
                resolve(res.statusCode);
            })
                .on('error', function(err){
                    resolve(404);
                });

        }

    });
}
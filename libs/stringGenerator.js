module.exports = function(n){
    var s ='';
    while(s.length < n)
        s += String.fromCharCode(Math.random() *127).replace(/\W|\d|_/g,'');
    return s;
};
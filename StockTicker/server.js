var app = require('express')();
var http = require('http');

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/finance', function (req,res) {
   var stock = req.query.symbol || 'EURUSD' ;
   http.get('http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in ("' + stock + '")&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=', function (response) {
       var data = "";
       response.on('data', function (chunk) {
           data += chunk;
       });

       response.on('end', function () {
           res.send(data);
       });

   })
});

app.listen(3333, function () {
    console.log('server running');
});
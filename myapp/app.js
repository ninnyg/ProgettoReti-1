var express = require('express');
var app = express();


app.get('/', function (req, res) {
  res.send('<H1>Ciao sono Fiorella</H1>');
});

app.post('/static', function (req, res) {
  res.sendFile('/home/biar/Desktop/myapp/my/public/images/fiore.jpg');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

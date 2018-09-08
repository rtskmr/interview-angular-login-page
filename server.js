var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

app.use('/js', express.static(path.join(__dirname, './js/')));
app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname,"./index.html"));
});

server.listen(8080, function() {
  console.log("Server is listening at 8080");
});

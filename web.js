var express = require("express");
var fs = require('fs');
var app = express();

var readFile = function(file, response) {
	console.log('Reading %s', file);
	response.sendfile('./' + file, { maxAge: 3600*24*7*1000 });
};

app.use(express.logger());
app.use(express.compress());

app.set('title', 'ClassJS');

app.get('/', function(request, response) {
	readFile('index.html', response);
});

app.get('/:dir/:file', function(request, response) {
	readFile(request.params.dir + '/' + request.params.file, response);
});

// grabs the port parameter from command-line, or the heroku env port. Fallback to 5k
var port = process.argv.length > 2 ? process.argv[2] : (process.env.PORT || 5000);
app.listen(port);
console.log('Server running on port %d', port);
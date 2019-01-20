var express = require('./node_modules/express');
var app = express();
var sqlite3 = require('./node_modules/sqlite3');
var db = new sqlite3.Database('baza.db');
var bodyParser = require('./node_modules/body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Staticki fajlovi su u folder-u public.
app.use(express.static('public'));

//-------------------------------------------------------

app.get('/', function(req, res) 
{
    res.sendFile("./public/" + "index.html");
});

//--------------------- SERVER --------------------------

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
});

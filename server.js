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

app.get('/svi_recepti', function(req, res)
{
    db.all("SELECT rowid, * FROM recept", function(err, rows)
    {
        if (err)
            console.log(err);
        else
            res.send(JSON.stringify(rows));
    });
});

app.post('/dodaj_recept', urlencodedParser, function(req, res)
{
    if (req.body.naziv === "")
    {
        res.send("alert('Niste popunili polje za naziv recepta');")
    }
    else
    {
        //console.log(req.body);
        var opis = req.body.opis === "" ? null : req.body.opis;
        db.run("INSERT INTO recept(naziv, opis) VALUES(?,?)", req.body.naziv, opis);
        res.send("alert('Uspesno dodat recept!');");
    }
});

app.post('/obrisi_recept', urlencodedParser, function(req, res)
{
    db.run("DELETE FROM receptSastojci WHERE idRecepta = '" + req.body.idRecepta + "'");
    db.run("DELETE FROM recept WHERE rowid = '" + req.body.idRecepta + "'");
    res.send("alert('Uspesno obrisano!');");
});

app.get('/daj_sastojke_za_recept', function(req,res)
{
    var id = req.query.idRecepta;
    console.log(id);
    db.all("SELECT rs.rowid, rs.kolicina, rs.mera, r.naziv nazivRecepta, r.opis, s.naziv nazivSastojka FROM receptSastojci rs JOIN recept r ON rs.idRecepta = r.rowid JOIN sastojak s ON rs.idSastojka = s.rowid WHERE rs.idRecepta = "+ id +"", function(err,rows)
    {
        if (err)
            console.log(err);
        else
            res.send(JSON.stringify(rows));
    });
});

/*
app.post('/izmeni_sastojak_recepta', urlencodedParser, function(req, res)
{
    if ((req.body.kolicina <= 0) || (req.body.mera === ""))
    {
        res.send("alert('Morate uneti vrednost za kolicinu i meru!');");
    }  
    else
    {
        console.log(req.body);
        db.run("UPDATE receptSastojci SET kolicina = ? , mera = '?' WHERE rowid = '?'", req.body.kolicina, req.body.mera, req.body.rowid);
    }
});
*/

//--------------------- SERVER --------------------------

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
});

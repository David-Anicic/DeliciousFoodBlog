// Sema baze

// recept - rowid, naziv, opis, photo
// sastojak - rowid, naziv
// receptSastojci - rowid, idRecepta, idSastojka, kolicina, mera

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

app.get('/svi_sastojci', function(req, res)
{
    db.all("select rowid, * from sastojak where rowid not in (select idSastojka from receptSastojci where idRecepta = '"+ req.query.idRecepta +"' )", function(err, rows)
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
        res.send("alert('Niste popunili polje za naziv recepta');");
    }
    else
    {
        var opis = req.body.opis === "" ? null : req.body.opis;
        db.run("INSERT INTO recept(naziv, opis) VALUES(?,?)", req.body.naziv, opis, function(err)
        {
            if (err)
                console.log(err);
            else
                res.send("alert('Uspesno dodat recept!');");
        });
    }
});

app.post('/obrisi_recept', urlencodedParser, function(req, res)
{
    db.serialize(function()
    {
        db.run("DELETE FROM receptSastojci WHERE idRecepta = '" + req.body.idRecepta + "'", function(err)
        {
            if (err)
                console.log(err);
            else
            {    
                db.run("DELETE FROM recept WHERE rowid = '" + req.body.idRecepta + "'", function(err)
                {
                    if (err)
                        console.log(err);
                    else
                        res.send("alert('Uspesno obrisano!');");
                });
            }
        });
    });
});

app.get('/daj_sastojke_za_recept', function(req,res)
{
    var id = req.query.idRecepta;
    db.all("SELECT rs.rowid, rs.kolicina, rs.mera, r.naziv nazivRecepta, r.opis, s.naziv nazivSastojka FROM receptSastojci rs JOIN recept r ON rs.idRecepta = r.rowid JOIN sastojak s ON rs.idSastojka = s.rowid WHERE rs.idRecepta = "+ id +"", function(err,rows)
    {
        if (err)
            console.log(err);
        else
            res.send(JSON.stringify(rows));
    });
});

app.post('/izmeni_sastojak_recepta', urlencodedParser, function(req, res)
{
    if ((req.body.kolicina === "") || (req.body.mera === ""))
    {
        res.send("alert('Morate uneti vrednost za kolicinu i meru!');");
    }  
    else
    {
        db.run("UPDATE receptSastojci SET kolicina='" + req.body.kolicina + "' , mera='" + req.body.mera + "' WHERE rowid='" + req.body.rowid + "'", function(err)
        {
            if (err)
                console.log(err);
            else
                res.send("alert('Uspesno ste izmenili sastojak za recept!');");
        });
    }
});

app.post('/izbrisi_sastojak_recepta', urlencodedParser, function(req, res)
{
    db.run("DELETE FROM receptSastojci WHERE rowid = '"+ req.body.rowid + "'", function(err)
    {
        if (err)
            console.log(err);
        else
            res.send("alert('Uspesno ste obrisali sastojak recepta!');");
    });
});

app.post('/dodaj_sastojak_za_recept', urlencodedParser, function(req, res)
{
    if (req.body.idRecepta === "" || req.body.idSastojka === "" || req.body.kolicina === "" || req.body.mera === "")
    {
        res.send("alert('Niste popunili sva polja!');");
    }
    else
    {
        db.run("INSERT INTO receptSastojci(idRecepta, idSastojka, kolicina, mera) VALUES(?,?,?,?)", req.body.idRecepta, req.body.idSastojka, req.body.kolicina, req.body.mera, function(err)
        {
            if (err)
                console.log(err);
            else
                res.send("alert('Uspesno ste dodali sastojak za recept!');");
        });
    }
})

//--------------------- SERVER --------------------------

var server = app.listen(3000, function() {
    var port = server.address().port;

    console.log("App listening at http://localhost:%s", port);
});

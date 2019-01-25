// Sema baze

// recept - rowid, naziv, opis, photo
// sastojak - rowid, naziv
// receptSastojci - rowid, idRecepta, idSastojka, kolicina, mera

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('baza.db');

db.serialize(function()
{
    // Recept
    db.run("CREATE TABLE if not exists recept(naziv TEXT NOT NULL, opis TEXT NULL, photo TEXT NULL)", function(err)
    {
        if (err)
            console.log(err);
        else
            console.log("Tabela -- Recept -- uspesno kreirana.");
    });

    // Sastojak
    db.run("CREATE TABLE if not exists sastojak(naziv TEXT NOT NULL)", function(err){
        if (err)
            console.log(err);
        else   
            console.log("Tabela -- Sastojak -- uspesno kreirana.");
    });

    // ReceptSastojci
    db.run("CREATE TABLE if not exists receptSastojci(idRecepta INTEGER NOT NULL, idSastojka INTEGER NOT NULL, kolicina REAL NULL, mera TEXT NULL, FOREIGN KEY (idRecepta) REFERENCES recept(rowid), FOREIGN KEY (idSastojka) REFERENCES sastojak(rowid))", function(err)
    {
        if (err)
            console.log(err);
        else
            console.log("Tabela -- receptSastojci -- uspesno kreirana.");
    });

    // Unos u bazu
    var stmt = db.prepare("INSERT INTO recept(naziv, opis, photo) VALUES(?,?,?)");
    stmt.run("Kolac sa jagodama","Lako spremite veoma ukusan kolac sa omiljenim letnjim vocem.", "bg2.jpg");
    stmt.finalize();

    stmt = db.prepare("INSERT INTO sastojak(naziv) VALUES (?)");
    stmt.run("jagode");
    stmt.run("prasak za pecivo");
    stmt.run("secer");
    stmt.run("mleko");
    stmt.finalize();

    stmt = db.prepare("INSERT INTO receptSastojci(idRecepta, idSastojka, kolicina, mera) VALUES (?,?,?,?)");
    stmt.run(1,1,300,"g");
    stmt.run(1,2,5,'g');
    stmt.run(1,3,200,'g');
    stmt.run(1,4,200,"ml");
    stmt.finalize();
});

db.close();
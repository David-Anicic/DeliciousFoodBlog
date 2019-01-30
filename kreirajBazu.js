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
    stmt.run("Pržena piletina","Ako volite piletinu, ali i šampinjone onda je ovo pravo jelo za vas!", "");
    stmt.run("Grčka salata","Jako poznata salata širom sveta!", "");
    stmt.run("Princes krofne","Uz naš recept za princes krofne uživaćete u njima uveravamo vas!", "");
    stmt.finalize();

    stmt = db.prepare("INSERT INTO sastojak(naziv) VALUES (?)");

    stmt.run("belo meso");
    stmt.run("prasak za pecivo");
    stmt.run("secer");
    stmt.run("mleko");
    stmt.run("šampinjoni");
    stmt.run("crni luk");
    stmt.run("česne belog luka");
    stmt.run("šargarepa");
    stmt.run("kašika začina");
    stmt.run("kašika kisele pavlake");
    stmt.run("kašika gustina");
    stmt.run("pirinač");

    stmt.run("paradajz");
    stmt.run("zelena salata");
    stmt.run("paprike zelene");
    stmt.run("feta sir");
    stmt.run("origano");
    stmt.run("so");
    stmt.run("maslinovo ulje");
    stmt.run("sirće");
    stmt.run("masline");

    stmt.run("voda");
    stmt.run("ulje");
    stmt.run("brašno");
    stmt.run("jaja");

    stmt.finalize();

    stmt = db.prepare("INSERT INTO receptSastojci(idRecepta, idSastojka, kolicina, mera) VALUES (?,?,?,?)");
    stmt.run(1,1,500,"g");
    stmt.run(1,5,500,"g");
    stmt.run(1,6,1,"komad");
    stmt.run(1,7,2,"komada");
    stmt.run(1,8,1,"komad");
    stmt.run(1,9,1,"");
    stmt.run(1,10,1,"");
    stmt.run(1,12,200,"g");

    stmt.run(2,13,2,"komada");
    stmt.run(2,14,1,"komad");
    stmt.run(2,15,2,"komada");
    stmt.run(2,6,1,"komad");
    stmt.run(2,16,30,"g");
    stmt.run(2,17,5,"mg");
    stmt.run(2,18,3,"mg");
    stmt.run(2,19,10,"ml");
    stmt.run(2,20,12,"ml");
    stmt.run(2,21,5,"komada");
    
    stmt.run(3,22,100,"ml");
    stmt.run(3,23,100,"ml");
    stmt.run(3,18,3,"mg");
    stmt.run(3,24,100,"g");
    stmt.run(3,25,4,"komada");
    stmt.run(3,3,30,"g");
    stmt.run(3,4,1,"l");

    stmt.finalize();
});

db.close();
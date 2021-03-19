const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({

    host: "localhost",
    user: "plan_ai_admin",
    password: "secret",
    database : "plan_ai"

});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

db.connect(function(err) {
    if (err) console.error(err);
    console.log("Connecté à la base de données MySQL!");
});

/*app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !!!!! !' });
});*/

app.get('/slots', (req, res, next) => {
    /*db.connect(function(err) {
        if (err) throw err;
        console.log("Connecté à la base de données MySQL!");*/
        db.query("SELECT * FROM slots join slots_class on slots.slots_id=slots_class.slots_id", function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
            console.log(result);
        });
    /*});*/
})

app.get('/classes', (req, res, next) => {
    db.query("SELECT * FROM class", function (err, result){
        if(err) throw err;
        res.status(200).json(result);
    })
})

app.get('/classes/:id', (req, res, next) => {
    db.query("SELECT * FROM class where class.class_id=?",[req.params.id], function (err, result){
        if(err) throw err;
        res.status(200).json(result);
    })
})

module.exports = app;

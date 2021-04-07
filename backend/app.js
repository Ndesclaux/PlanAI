const express = require('express');
const bodyParser = require("body-parser");
const slotRoute = require('./routes/slot.routes');

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

require("./routes/slot.routes.js")(app);
require("./routes/classe.route.js")(app);

/*app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !!!!! !' });
});*/

/*app.get('/slots', (req, res, next) => {

    db.query("SELECT * FROM slots join slots_class on slots.slots_id=slots_class.slots_id", function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
        console.log(result);
    });
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
})*/


module.exports = app;

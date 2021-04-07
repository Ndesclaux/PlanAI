const mysql = require('mysql');

const connection = mysql.createConnection({

    host: "localhost",
    user: "plan_ai_admin",
    password: "secret",
    database : "plan_ai"

});

connection.connect(function(err) {
    if (err) console.error(err);
    console.log("Connecté à la base de données MySQL!");
});

module.exports = connection;

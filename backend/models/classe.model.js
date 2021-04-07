const sql = require("./db.js")

const Classe = function (classe) {
    this.classe_id = classe.classe_id;
    this.classe_name = classe.classe_name;
}

Classe.create = (newClasse, result) => {
    sql.query("INSERT INTO class SET ?", newClasse, (err, res) => {
        if (err){
            console.log(err);
            result(null);
            return;
        }

        console.log("created classe: ", { id: res.insertId, ...newClasse });
        result(null, { id: res.insertId, ...newClasse });
    })
};

Classe.findById = (classeId, result) => {
    sql.query(`SELECT * FROM class WHERE class_id = ${classeId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found class: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Classe with the id
        result({ kind: "not_found" }, null);
    });
};

Classe.getAll = result => {
    sql.query("SELECT * FROM class", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("Classes: ", res);
        result(null, res);
    });
};

module.exports = Classe;

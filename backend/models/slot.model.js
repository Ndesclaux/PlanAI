const sql = require("./db.js")

const Slot = function(slot){
    this.slots_id = slot.slots_id;
    this.slots_title = slot.slots_title;
    this.slots_startDate = slot.slots_startDate;
    this.slots_endDate = slot.slots_endDate;
    this.slots_type = slot.slots_type;
    this.slots_description = slot.slots_description;
    this.slots_classes = slot.slots_classes;
}

Slot.create = (newSlot, result) => {
    sql.query("INSERT INTO slots SET slots_id=?, slots_title=?, slots_startDate=?, slots_endDate=?, slots_type=?",
        [newSlot.slots_id, newSlot.slots_title, newSlot.slots_startDate, newSlot.slots_endDate, newSlot.slots_type], (err, res)=> {
            if (err){
                console.log(err);
                result(null);
                return;
            }

            console.log("created slot: ", { id: res.insertId, ...newSlot });
            result(null, { id: res.insertId, ...newSlot });


            newSlot.slots_classes.forEach( (id) => {
                sql.query("INSERT INTO slots_class SET slots_class_id=null, slots_id=?, class_id=?",
                    [res.insertId, id], (err, res) => {
                        if (err){
                            console.log(err);
                            result(null);
                            return;
                        }

                        //console.log("classes linked: ", { id: res.insertId, ...id });
                        //result(null, { id: res.insertId, ...id });
                    })
            })

        })
};

Slot.findById = (slotId, result) => {
    sql.query(`SELECT * FROM slots JOIN slots_class on slots.slots_id = slots_class.slots_id
    WHERE slots_class.slots_id = ${slotId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {

            console.log("Réponse de la BDD");
            console.log(res[0].slots_startDate);
            slot = {
                slots_id: res[0].slots_id,
                slots_title: res[0].slots_title,
                slots_startDate: res[0].slots_startDate,
                slots_endDate: res[0].slots_endDate,
                slots_type: res[0].slots_type,
                slots_description: res[0].slots_description,
                slots_class_id: 4,
                class_id: []
            }

            res.forEach( s => {
                slot.class_id.push(s.class_id)
            })

            console.log("found slot: ", slot);
            result(null, slot);
            return;
        }

        // not found Slot with the id
        result({ kind: "not_found" }, null);
    });
};

Slot.getAll = result => {
    sql.query("SELECT * FROM slots join slots_class on slots.slots_id=slots_class.slots_id", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("Slots: ", res);
        result(null, res);
    });
};


/*
Il manque les classes à gérer encore !!!!
 */
Slot.updateById = (id, slot, result) => {
    sql.query(
        "UPDATE slots SET slots_title = ?, slots_startDate = ?, " +
        "slots_endDate = ?, slots_type = ?, slots_description = ?  WHERE slots_id = ?",
        [slot.slots_title, slot.slots_startDate, slot.slots_endDate, slot.slots_type, slot.slots_description, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result({ kind: "not_found" }, null);
                return;
            }


            sql.query("DELETE FROM slots_class WHERE slots_id="+id, (err2, res2) => {
                    if (err2) {
                        console.log("error: ", err2);
                        result(null, err2);
                        return;
                    }

                    slot.slots_classes.forEach( c => {
                        console.log("For each on classes "+c);
                        sql.query("INSERT INTO slots_class SET slots_class_id=NULL, slots_id=?, class_id=?",
                            [id, c], (err3, res3) => {
                                if (err3) {
                                    console.log("error: ", err3);
                                    result(null, err3);
                                    return;
                                }
                            }

                        )
                    })
                    console.log("updated slot: ", { id: id, ...slot });
                    result(null, { id: id, ...slot });
                }
            );


        }
    );
};

Slot.remove = (id, result) => {


    sql.query("DELETE FROM slots_class WHERE slots_id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            return;
        }
        //DELETE FROM slots WHERE slots_id = ?
        //DELETE FROM slots_class WHERE slots_id = ?

        sql.query("DELETE FROM slots WHERE slots_id = ?", id, (err2, res2) => {
            if (err2) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            console.log("Association deleted with id: ", id)
        })
        console.log("deleted slot with id: ", id);
        result(null, res);
    });
};

Slot.removeAll = result => {
    sql.query("DELETE FROM slots", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} slot`);
        result(null, res);
    });
};

module.exports = Slot;

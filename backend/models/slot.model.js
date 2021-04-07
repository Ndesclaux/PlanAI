const sql = require("./db.js")

const Slot = function(slot){
    this.slots_id = slot.slots_id;
    this.slots_title = slot.slots_title;
    this.slots_startDate = slot.slots_startDate;
    this.slots_endDate = slot.slots_endDate;
    this.slots_type = slot.slots_type;
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
    sql.query(`SELECT * FROM slots WHERE id = ${slotId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found slot: ", res[0]);
            result(null, res[0]);
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
        "slots_endDate = ?, slots_type = ?  WHERE id = ?",
        [slot.slots_title, slot.slots_startDate, slot.slots_endDate, slot.slots_type, id],
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

            console.log("updated slot: ", { id: id, ...slot });
            result(null, { id: id, ...slot });
        }
    );
};

Slot.remove = (id, result) => {
    sql.query("DELETE FROM slots WHERE id = ?", id, (err, res) => {
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

module.exports = app => {
    const Classe = require("../controllers/classes.controller.js");

    // Create a new Slot
    app.post("/classe", Classe.create);

    // Retrieve all Slots
    app.get("/classes", Classe.findAll);

    // Retrieve a single Slot with slotId
    app.get("/classe/:classeId", Classe.findOne);

    // Update a Slot with slotId
    app.put("/classe/:classeId", Classe.update);

    // Delete a Slot with slotId
    app.delete("/classe/:classeId", Classe.delete);

    // Delete all Slots
    app.delete("/classes", Classe.deleteAll);
};

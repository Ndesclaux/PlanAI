module.exports = app => {
    const Slot = require("../controllers/slots.controller.js");

    // Create a new Slot
    app.post("/slot", Slot.create);

    // Retrieve all Slots
    app.get("/slots", Slot.findAll);

    // Retrieve a single Slot with slotId
    app.get("/slot/:slotId", Slot.findOne);

    // Update a Slot with slotId
    app.put("/slot/:slotId", Slot.update);

    // Delete a Slot with slotId
    app.delete("/customers/:slotId", Slot.delete);

    // Delete all Slots
    app.delete("/slots", Slot.deleteAll);
};

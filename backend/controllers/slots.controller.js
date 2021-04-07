const Slot = require("../models/slot.model.js");

// Create and Save a new Slot
exports.create = (req, res) => {

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Slot
    const slot = new Slot({
       slots_id: null,
       slots_title: req.body.slots_title,
       slots_startDate: req.body.slots_startDate,
       slots_endDate: req.body.slots_endDate,
       slots_type: req.body.slots_type,
       slots_classes: req.body.slots_classes,
    });

    // Save Slot in the database
    Slot.create(slot, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Slot."
            });
        else res.send(data);
    });
};

// Retrieve all Slots from the database.
exports.findAll = (req, res) => {
    Slot.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    });
};

// Find a single Slot with a slotId
exports.findOne = (req, res) => {

};

// Update a Slot identified by the slotId in the request
exports.update = (req, res) => {

};

// Delete a Slot with the specified slotId in the request
exports.delete = (req, res) => {

};

// Delete all Slots from the database.
exports.deleteAll = (req, res) => {

};

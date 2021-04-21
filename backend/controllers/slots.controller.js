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
    Slot.findById(req.params.slotId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Slot with id ${req.params.slotId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Slot with id " + req.params.slotId
                });
            }
        } else res.send(data);
    });
};

// Update a Slot identified by the slotId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Slot.updateById(
        req.params.slotId,
        new Slot(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Customer with id ${req.params.slotId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Customer with id " + req.params.slotId
                    });
                }
            }
            else res.send(data);
        }
    );
};

// Delete a Slot with the specified slotId in the request       slotId
exports.delete = (req, res) => {
    Slot.remove(req.params.slotId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.slotId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Customer with id " + req.params.slotId
                });
            }
        } else res.send({ message: `Customer was deleted successfully!` });
    });
};

// Delete all Slots from the database.
exports.deleteAll = (req, res) => {

};

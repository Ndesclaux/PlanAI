const Classe = require("../models/classe.model");

// Create and Save a new Classe
exports.create = (req, res) => {

};

// Retrieve all Classes from the database.
exports.findAll = (req, res) => {
    Classe.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        else res.send(data);
    });
};

// Find a single Classe with a classeId
exports.findOne = (req, res) => {
    Classe.findById(req.params.classeId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Classe with id ${req.params.classeId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Classe with id " + req.params.classeId
                });
            }
        } else res.send(data);
    });
};

// Update a Classe identified by the classeId in the request
exports.update = (req, res) => {

};

// Delete a Classe with the specified classeId in the request
exports.delete = (req, res) => {

};

// Delete all Classes from the database.
exports.deleteAll = (req, res) => {

};

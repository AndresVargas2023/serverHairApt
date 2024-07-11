const Service = require("../models/service.model");

exports.createService = async (req, res) => {
    try {
        const { name, price, duration, imageUrl } = req.body;

        const newService = new Service({
            name,
            price,
            duration,
            imageUrl,
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ name: 1 });
        res.status(200).json(services);
    } catch (error) {
        console.error("Error getting services:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.status(200).json(service);
    } catch (error) {
        console.error("Error getting service by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedService);
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const deleted = await Service.deleteOne({ _id: req.params.id });
        res.status(200).json(deleted);
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

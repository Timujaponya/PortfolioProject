// Services controller

const serviceService = require("../services/serviceService");

// GET /api/services
exports.getAllServices = async (req, res, next) => {
    try {
        const services = await serviceService.getAllServices();
        res.status(200).json({ message: "Services found", services });
    } catch (err) {
        next(err);
    }
};

// GET /api/services/active
exports.getActiveServices = async (req, res, next) => {
    try {
        const services = await serviceService.getActiveServices();
        res.status(200).json({ message: "Active services found", services });
    } catch (err) {
        next(err);
    }
};

// GET /api/services/:id
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await serviceService.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service found", service });
    } catch (err) {
        next(err);
    }
};

// POST /api/services
exports.createService = async (req, res, next) => {
    try {
        const service = await serviceService.createService(req.body);
        res.status(201).json({ message: "Service created", service });
    } catch (err) {
        next(err);
    }
};

// PUT /api/services/:id
exports.updateService = async (req, res, next) => {
    try {
        const service = await serviceService.updateService(req.params.id, req.body);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service updated", service });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
    try {
        const service = await serviceService.deleteService(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted" });
    } catch (err) {
        next(err);
    }
};

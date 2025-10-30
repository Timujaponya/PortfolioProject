// Servis service layer

const serviceRepository = require("../repositories/serviceRepository");

exports.getAllServices = async () => {
    return await serviceRepository.getAllServices();
};

exports.getActiveServices = async () => {
    return await serviceRepository.getActiveServices();
};

exports.getServiceById = async (id) => {
    return await serviceRepository.getServiceById(id);
};

exports.createService = async (data) => {
    return await serviceRepository.createService(data);
};

exports.updateService = async (id, data) => {
    return await serviceRepository.updateService(id, data);
};

exports.deleteService = async (id) => {
    return await serviceRepository.deleteService(id);
};

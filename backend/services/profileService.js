// Profil service

const profileRepository = require("../repositories/profileRepository");

exports.getProfile = async () => {
    return await profileRepository.getProfile();
};

exports.createProfile = async (data) => {
    return await profileRepository.createProfile(data);
};

exports.updateProfile = async (id, data) => {
    return await profileRepository.updateProfile(id, data);
};

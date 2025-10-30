// Veritabanı ile bağlantılı işlemler buradan yönetiliyor.

const Project = require("../models/Project");

async function getAllProjects(){return await Project.find();};
async function getProjectById(id){return await Project.findById(id)};
async function createProject(data){return await Project.create(data)};
async function updateProject(id,data){return await Project.findByIdAndUpdate(id,data, { new: true, runValidators: true })};
async function deleteProject(id){return await Project.findByIdAndDelete(id)};


module.exports = {getAllProjects, getProjectById, createProject, updateProject, deleteProject}
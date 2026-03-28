// işlem mantıkları CRUD operations ve benzeriler burada yönetiliyor


const projectRepository = require("../repositories/projectRepository");
const { getUserRepositories } = require("../utils/githubApi");

async function getProjects(){
    try {
        const [dbProjects, githubRepositories] = await Promise.all([
            projectRepository.getAllProjects(),
            getUserRepositories("Timujaponya").catch(err => {
                console.error("GitHub API Error:", err.message);
                return []; // GitHub hatası durumunda boş array döndür
            }),
        ]);
        return {dbProjects, githubRepositories};
    } catch (error) {
        console.error("Error in getProjects:", error);
        // En azından DB projelerini döndür
        const dbProjects = await projectRepository.getAllProjects();
        return {dbProjects, githubRepositories: []};
    }
}

async function createProject(data){
    if(!data.title) throw new Error("Title required");
    return await projectRepository.createProject(data);
}

async function updateProject(id, data){
    if(!id || !data) throw new Error("Project id and update data is required");
    return await projectRepository.updateProject(id,data);
}

async function getProjectById(id){
    if(!id)throw new Error("Id is required");
    return await projectRepository.getProjectById(id);
}

async function deleteProject(id){
    if(!id) throw new Error("Id is required");
    return await projectRepository.deleteProject(id);
}


module.exports = {getProjectById, getProjects, createProject, updateProject, deleteProject}
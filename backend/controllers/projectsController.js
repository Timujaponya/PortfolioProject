require("dotenv").config();
const projectService = require("../services/projectService");

// GET /api/projects
exports.getProjects = async(req,res) => {
    try{
        const result = await projectService.getProjects(); 

        res.status(200).json({message: "projects found",result});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error occured"});
    }
};


// POST /api/projects
exports.postProject = async (req, res) => {
    try {
        const project = await projectService.createProject(req.body);
        res.status(201).json({ message: "project added" , project});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
};



// PUT /api/projects/:id
exports.putProject = async (req, res) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await projectService.updateProject(updateId, updateData);
    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};

// PATCH /api/projects/:id
exports.patchProject = async (req, res) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await projectService.updateProject(updateId, updateData);

    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) =>{
    const deleteId = req.params.id;
    try{
        if(!deleteId){
            return res.status(500).json({message:"cant find project (incorrect id)"});
        }
        const deletedData = await projectService.deleteProject(deleteId);
        res.status(201).json({message:"Data deleted successfully", deletedData});
    } catch(err){
        console.log(err);
        res.status(500).json("error has occured");
    }
};


// GET /api/projects/:id
exports.getProjectbyId = async(req,res)=>{
    const projectSearchId = req.params.id;
    try{
        if(!projectSearchId){
            res.status(500).json("an error has occured (cant find project)");
        }
        const result = await projectService.getProjectById(projectSearchId);
        res.status(200).json({message:"get request successfull", result});
    } catch(err){
        console.log(err);
        res.status(500).json("an error has occured");
    }
};

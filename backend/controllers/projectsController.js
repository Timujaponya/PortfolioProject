// Gelen ve giden isteklerin yönetildiği alan routelar vb. buradan.


const projectService = require("../services/projectService");

// GET /api/projects
exports.getProjects = async(req, res, next) => {
    try{
        const result = await projectService.getProjects(); 

        res.status(200).json({message: "projects found",result});
    }catch(err){
        next(err)
    }
};


// POST /api/projects
exports.postProject = async (req, res, next) => {
    try {
        const project = await projectService.createProject(req.body);
        res.status(201).json({ message: "project added" , project});
    } catch (err) {
        next(err)
    }
};



// PUT /api/projects/:id
exports.putProject = async (req, res, next) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await projectService.updateProject(updateId, updateData);
    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
        next(err)
  }
};

// PATCH /api/projects/:id
exports.patchProject = async (req, res, next) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await projectService.updateProject(updateId, updateData);

    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
        next(err)
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) =>{
    const deleteId = req.params.id;
    try{
        if(!deleteId){
            return res.status(500).json({message:"cant find project (incorrect id)"});
        }
        const deletedData = await projectService.deleteProject(deleteId);
        res.status(201).json({message:"Data deleted successfully", deletedData});
    } catch(err){
        next(err)
    }
};


// GET /api/projects/:id
exports.getProjectbyId = async(req, res, next)=>{
    const projectSearchId = req.params.id;
    try{
        if(!projectSearchId){
            res.status(500).json("an error has occured (cant find project)");
        }
        const result = await projectService.getProjectById(projectSearchId);
        res.status(200).json({message:"get request successfull", result});
    } catch(err){
        next(err)
    }
};

const express = require("express");
const router = express.Router();
const axios = require("axios");
const Project = require("../models/Project");

const githubToken = process.env.GITHUB_TOKEN;

// GitHub request fonksiyonu
async function getUserRepositories(user) {
    const response = await axios.get(`https://api.github.com/users/${user}/repos`, {
        timeout: 1000,
        headers: {
            'X-Custom-Header': 'foobar',
            Authorization: `${githubToken}`
        }
    });
    return response.data;
}


// GET /api/projects
router.get("/", async(req,res) => {
    try{
        const projects = await Project.find();

        const repositories = await getUserRepositories("Timujaponya");

        res.status(200).json({message:"projects found", projects, repositories});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error occured"});
    }
})



// // GET /api/projects
// router.get("/", async (req, res) => {
//     try {
//         const repositories = await getUserRepositories("Timujaponya");
//         res.status(200).json({ message: "user repos found", repositories });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "server error" });
//     }
// });


// POST /api/projects
router.post("/", async (req, res) => {
    try {
        const project = req.body;

        await Project.create(project);
        res.status(201).json({ message: "project added" , project});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
});



// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await Project.findByIdAndUpdate(updateId, updateData, { new: true, runValidators: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
});

// PATCH /api/projects/:id
router.patch("/:id", async (req, res) => {
  const updateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedData = await Project.findByIdAndUpdate(updateId, updateData, { new: true, runValidators: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(201).json({ message: "Data updated", updatedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) =>{
    const deleteId = req.params.id;
    try{
        if(!deleteId){
            return res.status(500).json({message:"cant find project (incorrect id)"});
        }
        const deletedData = await Project.findByIdAndDelete(deleteId);
        res.status(201).json({message:"Data deleted successfully", deletedData});
    } catch(err){
        console.log(err);
        res.status(500).json("error has occured");
    }
})


// GET /api/projects/:id
router.get("/:id", async(req,res)=>{
    const projectSearchId = req.params.id;
    try{
        if(!projectSearchId){
            res.status(500).json("an error has occured (cant find project)");
        }
        const getObject = await Project.findById(projectSearchId);
        res.status(200).json({message:"get request successfull", getObject});
    } catch(err){
        console.log(err);
        res.status(500).json("an error has occured");
    }
})



module.exports = router;
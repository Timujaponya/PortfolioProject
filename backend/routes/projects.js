const express = require("express");
const {getProjects, getProjectbyId, postProject, putProject, patchProject, deleteProject} = require('../controllers/projectsController');

const router = express.Router();

router.get('/', getProjects);
router.post('/', postProject);
router.put('/:id', putProject);
router.patch('/:id', patchProject);
router.delete('/:id', deleteProject);
router.get('/:id', getProjectbyId);


module.exports = router;
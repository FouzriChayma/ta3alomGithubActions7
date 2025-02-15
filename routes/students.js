var express=require('express');
const router = express.Router();

// Utilisation de "MODEL"  M
const student = require("../models/student");
// appeml du controller
const studentsController = require("../controllers/studentController");
// Utilisation de "Middlewar"
const validate = require("../middleware/validate");

router.get('/', (req,res)=>{res.end("students")});

router.get('/all', studentsController.getStudents);

router.get('/:id', studentsController.getbyid);

router.post('/add', validate, studentsController.addStudent);

router.put('/update/:id', validate, studentsController.updateStudent);

router.delete('/delete/:id', studentsController.deleteStudent);

module.exports = router;
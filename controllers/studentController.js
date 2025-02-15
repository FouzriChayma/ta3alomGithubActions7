const express = require("express");
const student = require("../models/student");

let io; // Déclarer io globalement pour y accéder dans les fonctions

// Fonction pour initialiser Socket.IO
function initSocket(socketIO) {
  io = socketIO;
  console.log('Socket.IO initialisé');
}


//get by id
async function getbyid(req, res) {
  try {
    const data = await student.findById(req.params.id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

//GETaLL
async function getStudents(req, res) {
    try {   
        const students = await student.find();
        res.send(students); 
      } catch (err) {
        res.send(err);
      }
}

// ADD Student
async function addStudent(req, res) {
  try {
    const newSt = new student(req.body);
    await newSt.save();

   // Emit a notification via Socket.IO
   if (io) {
    io.emit("studentAdded", {
      message: `Un nouvel étudiant a été ajouté : ${newSt.name}`,
      student: newSt,
    });
  }
  res.status(200).send("Student added");
  } catch (error) {
    res.status(400).send({ error: error.toString() });
  }
}





//update student
async function updateStudent(req, res) {
    try {   
        const id = req.params.id;
        await student.findByIdAndUpdate(id, req.body);
        res.status(200).send("student updated");
      } catch (err) {
        res.send(err);
      }
}

//delete 
async function deleteStudent(req, res) {
    try {   
        const id = req.params.id;
        await student.findByIdAndDelete(id);
        res.status(200).send("student deleted");
      } catch (err) {
        res.send(err);
      }
}


module.exports = { getStudents , getbyid , addStudent , updateStudent , deleteStudent , initSocket,};
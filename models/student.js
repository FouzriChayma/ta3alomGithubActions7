const mongo = require("mongoose");
const Schema = mongo.Schema;

const ETUDIANT = new Schema({
  name: String,
  email: String,
  code: Number,
});

module.exports = mongo.model("ETudiantscol", ETUDIANT,'EtudiantCollection');
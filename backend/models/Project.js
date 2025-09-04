// collection şeması/şekillendirilmesi ve mongoose kurulumu buradan

const mongoose = require("mongoose");

// Proje modeli şeması
const projectSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description: String,
    link: String,
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now}
});


// Proje güncellerken tarih ayarlama
projectSchema.pre("findOneAndUpdate", function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});


const Project = mongoose.model("Project", projectSchema)

module.exports = Project;
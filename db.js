const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
    email : {type : String , unique : true , required : true,},
    firstName :{type : String , required : true},
    lastName : {type : String , required : true},
    password : {type : String , required : true},


})
const Admin = new Schema({
    email : {type : String , unique : true , required : true,},
    firstName :{type : String , required : true},
    lastName : {type : String , required : true},
    password : {type : String , required : true},


})
const Assignment = new Schema({
    userId : {type : ObjectId , ref : 'User' , required : true},
    adminId : {type : ObjectId , ref : 'Admin'},
    task : {type : String},
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Status of the assignment
    createdAt: { type: Date, default: Date.now() },


})

const userModel = mongoose.model('User', User);
const adminModel = mongoose.model('Admin', Admin);
const assignmentModel = mongoose.model('Assignment', Assignment);


module.exports = {
    userModel,
    adminModel,
    assignmentModel
}
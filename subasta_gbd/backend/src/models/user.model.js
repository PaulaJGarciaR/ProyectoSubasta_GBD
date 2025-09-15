import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  secondLastName: {
    type: String,
  },
  documentType: {
    type: String,
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  documentIssueDate: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },

  birthDate: {
    type: Date,
    required: true,
  },
  password:{
    type:String,
    required:true
  },
},
{timestamps:true});

export default mongoose.model('User',userSchema);


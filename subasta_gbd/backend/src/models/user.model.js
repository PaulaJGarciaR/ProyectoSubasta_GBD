import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userType:{
      type:String
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
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
      minlength: 10,
    },
    documentIssueDate: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
      minlength: 3,
    },
    state: {
      type: String,
      required: true,
      minlength: 3,
    },
    city: {
      type: String,
      required: true,
      minlength: 3,
    },
    address: {
      type: String,
      required: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
    },

    birthDate: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    },
    personType:{
      type:String,
    },
     nitPersonaNatural: {
      type: String,
      sparse: true,
      required: false,
      minlength: 9,
    },
    razonSocial: {
      type: String,
      required: false,
      minlength: 3,
    },
     sociedad: {
      type: String,
      required: false,
    },

    nitPersonaJuridica: {
      type: String,
      sparse: true,
      required: false,
      minlength: 9,
    },
    matriculaMercantil: {
      type: String,
      sparse: true,
      required: false,
    },
    fechaDeConstitucion:{
       type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

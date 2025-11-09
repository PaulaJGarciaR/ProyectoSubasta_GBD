import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    firstName: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    secondLastName: {
      type: String,
    },
    documentType: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
    },
    documentNumber: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      unique: true,
      sparse: true,
      minlength: 10,
    },
    documentIssueDate: {
      type: Date,
      required: function() { 
        return !this.isAdmin; 
      },
    },
    country: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    state: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    city: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    address: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: function() { 
        return !this.isAdmin; 
      },
      minlength: 10,
    },
    birthDate: {
      type: Date,
      required: function() { 
        return !this.isAdmin; 
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    },
    personType: {
      type: String,
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
    fechaDeConstitucion: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
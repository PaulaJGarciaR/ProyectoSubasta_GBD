import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    secondLastName,
    documentType,
    documentNumber,
    documentIssueDate,
    country,
    state,
    city,
    address,
    email,
    phone,
    birthDate,
    password,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      secondLastName,
      documentType,
      documentNumber,
      documentIssueDate,
      country,
      state,
      city,
      address,
      email,
      phone,
      birthDate,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      id:userSaved._id,
      firstName:userSaved.firstName,
      middleName:userSaved.middleName,
      lastName:userSaved.lastName,
      secondLastName:userSaved.secondLastName,
      documentType:userSaved.documentType,
      documentNumber:userSaved.documentNumber,
      documentIssueDate:userSaved.documentIssueDate,
      country:userSaved.country,
      state:userSaved.state,
      city:userSaved.city,
      address:userSaved.address,
      email:userSaved.email,
      phone:userSaved.phone,
      birthDate:userSaved.birthDate,
      createdA:userSaved.createdAt,
      updatedA:userSaved.updatedAt
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const userFound=await User.findOne({email})
    if(!userFound) return res.status(400).json({message:"User not found"});

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({message: "Incorrect password"});

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({
      id:userFound._id,
      email:userFound.email,
      createdA:userFound.createdAt,
      updatedA:userFound.updatedAt
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const logout = (req,res) => {
   res.cookie("token","", {
    expires:new Date(0),
   });
   return res.sendStatus(200);
}

export const profile = async (req,res)=> {
  const userFound = await User.findById(req.user.id);

  if(!userFound) return res.status(400).json({message:"User not found"});

  return res.json({
      id:userFound._id,
      email:userFound.email,
      createdA:userFound.createdAt,
      updatedA:userFound.updatedAt
    });
} 
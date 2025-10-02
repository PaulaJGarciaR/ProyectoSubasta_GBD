import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
  const {
    userType,
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
    personType,
    nitPersonaNatural,
    razonSocial,
    sociedad,
    nitPersonaJuridica,
    matriculaMercantil,
    fechaDeConstitucion,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El email ya existe"]);

    const userDocument = await User.findOne({ documentNumber });
    if (userDocument)
      return res
        .status(400)
        .json([
          "El número de documento de identidad ya se encuentra registrado",
        ]);

    if (nitPersonaNatural && nitPersonaNatural.trim() !== "") {
      const userNitPersonaNatural = await User.findOne({ nitPersonaNatural });
      if (userNitPersonaNatural) {
        return res.status(400).json(["Este NIT ya se encuentra registrado"]);
      }
    }

    if (nitPersonaJuridica && nitPersonaJuridica.trim() !== "") {
      const userNitPersonaJuridica = await User.findOne({ nitPersonaJuridica });
      if (userNitPersonaJuridica) {
        return res.status(400).json(["Este NIT ya se encuentra registrado"]);
      }
    }

     if (matriculaMercantil && matriculaMercantil.trim() !== "") {
      const userMatriculaMercantil = await User.findOne({ matriculaMercantil });
      if (userMatriculaMercantil) {
        return res.status(400).json(["Este número mercantil ya se encuentra registrado"]);
      }
    }


    const newUser = new User({
      userType,
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
      personType,
      nitPersonaNatural,
      razonSocial,
      sociedad,
      nitPersonaJuridica,
      matriculaMercantil,
      fechaDeConstitucion,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      userType: userSaved.userType,
      firstName: userSaved.firstName,
      middleName: userSaved.middleName,
      lastName: userSaved.lastName,
      secondLastName: userSaved.secondLastName,
      documentType: userSaved.documentType,
      documentNumber: userSaved.documentNumber,
      documentIssueDate: userSaved.documentIssueDate,
      country: userSaved.country,
      state: userSaved.state,
      city: userSaved.city,
      address: userSaved.address,
      email: userSaved.email,
      phone: userSaved.phone,
      birthDate: userSaved.birthDate,
      personType: userSaved.personType,
      nitPersonaNatural: userSaved.nitPersonaNatural,
      razonSocial: userSaved.razonSocial,
      sociedad: userSaved.sociedad,
      nitPersonaJuridica: userSaved.nitPersonaJuridica,
      matriculaMercantil: userSaved.matriculaMercantil,
      fechaDeConstitucion: userSaved.fechaDeConstitucion,
      createdA: userSaved.createdAt,
      updatedA: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["User not found"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña Incorrecta" });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token,
      {
        sameSite:'none',
        secure:true,
        httpOnly:false
      }
    );
    res.json({
      id: userFound._id,
      email: userFound.email,
       userType: userFound.userType,
      createdA: userFound.createdAt,
      updatedA: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "User not found" });

    return res.json({
      id: userFound._id,
      userType: userFound.userType,
      firstName: userFound.firstName,
      middleName: userFound.middleName,
      lastName: userFound.lastName,
      secondLastName: userFound.secondLastName,
      documentType: userFound.documentType,
      documentNumber: userFound.documentNumber,
      documentIssueDate: userFound.documentIssueDate,
      country: userFound.country,
      state: userFound.state,
      city: userFound.city,
      address: userFound.address,
      email: userFound.email,
      phone: userFound.phone,
      birthDate: userFound.birthDate,
      personType: userFound.personType,
      nitPersonaNatural: userFound.nitPersonaNatural,
      razonSocial: userFound.razonSocial,
      sociedad: userFound.sociedad,
      nitPersonaJuridica: userFound.nitPersonaJuridica,
      matriculaMercantil: userFound.matriculaMercantil,
      fechaDeConstitucion: userFound.fechaDeConstitucion,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Agregar esta función en tu archivo auth.controller.js

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Limpiar campos vacíos para evitar errores de validación
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === '' || profileData[key] === null || profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    // Validar que no se intente cambiar el email a uno existente
    if (profileData.email) {
      const emailExists = await User.findOne({ 
        email: profileData.email,
        _id: { $ne: userId }
      });
      if (emailExists) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
    }

    // Validar documento único
    if (profileData.documentNumber) {
      const docExists = await User.findOne({ 
        documentNumber: profileData.documentNumber,
        _id: { $ne: userId }
      });
      if (docExists) {
        return res.status(400).json({ message: "El número de documento ya está registrado" });
      }
    }

    // Validar NITs únicos solo si tienen valor
    if (profileData.nitPersonaNatural) {
      const nitExists = await User.findOne({ 
        nitPersonaNatural: profileData.nitPersonaNatural,
        _id: { $ne: userId }
      });
      if (nitExists) {
        return res.status(400).json({ message: "Este NIT ya está registrado" });
      }
    }

    if (profileData.nitPersonaJuridica) {
      const nitExists = await User.findOne({ 
        nitPersonaJuridica: profileData.nitPersonaJuridica,
        _id: { $ne: userId }
      });
      if (nitExists) {
        return res.status(400).json({ message: "Este NIT ya está registrado" });
      }
    }

    if (profileData.matriculaMercantil) {
      const matExists = await User.findOne({ 
        matriculaMercantil: profileData.matriculaMercantil,
        _id: { $ne: userId }
      });
      if (matExists) {
        return res.status(400).json({ message: "Esta matrícula mercantil ya está registrada" });
      }
    }

    // No permitir actualizar la contraseña desde este endpoint
    delete profileData.password;

    // Actualizar el usuario (sin runValidators para campos opcionales)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      profileData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: updatedUser._id,
      userType: updatedUser.userType,
      firstName: updatedUser.firstName,
      middleName: updatedUser.middleName,
      lastName: updatedUser.lastName,
      secondLastName: updatedUser.secondLastName,
      documentType: updatedUser.documentType,
      documentNumber: updatedUser.documentNumber,
      documentIssueDate: updatedUser.documentIssueDate,
      country: updatedUser.country,
      state: updatedUser.state,
      city: updatedUser.city,
      address: updatedUser.address,
      email: updatedUser.email,
      phone: updatedUser.phone,
      birthDate: updatedUser.birthDate,
      personType: updatedUser.personType,
      nitPersonaNatural: updatedUser.nitPersonaNatural,
      razonSocial: updatedUser.razonSocial,
      sociedad: updatedUser.sociedad,
      nitPersonaJuridica: updatedUser.nitPersonaJuridica,
      matriculaMercantil: updatedUser.matriculaMercantil,
      fechaDeConstitucion: updatedUser.fechaDeConstitucion,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound._id,
      email: userFound.email,
      userType: userFound.userType,
    });
  });
};

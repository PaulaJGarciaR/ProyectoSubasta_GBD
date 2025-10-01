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
    });
  });
};

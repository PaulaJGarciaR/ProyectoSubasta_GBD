import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../backend/src/models/user.model.js";

const ADMIN_CONFIG = {
  email: "pjgarciar@ufpso.edu.co",
  password: "A1234567#", 
  userType: "admin",
  isAdmin: true,
};

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/merndb");
    
    console.log("Conectado a MongoDB");

    const existingAdmin = await User.findOne({ email: ADMIN_CONFIG.email });

    if (existingAdmin) {
      console.log("El administrador ya existe en la base de datos");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(ADMIN_CONFIG.password, 10);

    const adminUser = new User({
      email: ADMIN_CONFIG.email,
      password: passwordHash,
      userType: ADMIN_CONFIG.userType,
      isAdmin: ADMIN_CONFIG.isAdmin,
    });

    await adminUser.save();

    console.log(" Usuario administrador creado exitosamente");
    console.log("Email:", ADMIN_CONFIG.email);
    console.log(" Contraseña:", ADMIN_CONFIG.password);
    console.log("\n IMPORTANTE: Cambia la contraseña después del primer login");

    process.exit(0);
  } catch (error) {
    console.error("Error al crear el administrador:", error);
    process.exit(1);
  }
};

createAdminUser();
export const ADMIN_CONFIG = {
  email: "pjgarciar@ufpso.edu.co",
  password: "A1234567#",
  nombre: "Administrador Principal",
  userType: "admin",
  role: "admin"
};

// Función para verificar si las credenciales son del admin
export const isAdminCredentials = (email, password) => {
  return email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password;
};

// Función para obtener el objeto de usuario admin
export const getAdminUser = () => {
  return {
    email: ADMIN_CONFIG.email,
    nombre: ADMIN_CONFIG.nombre,
    userType: ADMIN_CONFIG.userType,
    role: ADMIN_CONFIG.role,
    isAdmin: true,
    id: 'admin-hardcoded'
  };
};
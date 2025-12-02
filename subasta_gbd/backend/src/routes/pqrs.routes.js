import express from 'express';
import {
  createPQRS,
  getUserPQRS,
  getAllPQRS,
  getPQRSById,
  updatePQRSStatus,
  respondPQRS,
  respondPQRSAsUser,
  ratePQRS,
  getPQRSStats,
  acceptPQRS,
  rejectPQRS,
} from '../controllers/pqrs.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Acceso denegado. Solo administradores.'
    });
  }
  next();
};

// IMPORTANTE: Rutas específicas PRIMERO, rutas con parámetros DESPUÉS
// Esto evita que /pqrs/my sea interpretado como /pqrs/:id

// Rutas de estadísticas (Admin) - MUY ESPECÍFICAS
router.get('/pqrs/stats/overview', authRequired, isAdmin, getPQRSStats);

// Rutas del usuario - ESPECÍFICAS
router.get('/pqrs/my', authRequired, getUserPQRS);
router.post('/pqrs', authRequired, createPQRS);

// Rutas de administrador para todas las PQRS
router.get('/pqrs', authRequired, isAdmin, getAllPQRS);

// Rutas con ID de PQRS - DESPUÉS DE LAS ESPECÍFICAS
router.get('/pqrs/:id', authRequired, getPQRSById);

// Acciones del destinatario (comprador o vendedor)
router.put('/pqrs/:id/accept', authRequired, acceptPQRS);
router.put('/pqrs/:id/reject', authRequired, rejectPQRS);
router.post('/pqrs/:id/respond-user', authRequired, respondPQRSAsUser);

// Calificación (creador de la PQRS)
router.post('/pqrs/:id/rate', authRequired, ratePQRS);

// Acciones de administrador
router.put('/pqrs/:id/status', authRequired, isAdmin, updatePQRSStatus);
router.post('/pqrs/:id/respond', authRequired, isAdmin, respondPQRS);

export default router;
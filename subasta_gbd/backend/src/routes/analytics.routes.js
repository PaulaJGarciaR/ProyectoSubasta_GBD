import express from 'express';
import {
  createSession,
  validarSesion,
  cerrarSesion,
  registrarCategoriaClick,
  registrarIntentoPuja,
  actualizarTiempoSesion,
  obtenerEstadisticas,
  obtenerEstadisticasGenerales,
  obtenerSesionesUsuario,
  exportarDatos,
  obtenerTodasLasSesiones
} from '../controllers/analytics.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

// Crear nueva sesión 
router.post('/session/create', authRequired, createSession);

// Cerrar sesión 
router.post('/session/close', authRequired, cerrarSesion);

// Actualizar tiempo de sesión 
router.put('/session/time', authRequired, actualizarTiempoSesion);

// Registrar clic en categoría 
router.post('/category/click', authRequired, registrarCategoriaClick);

// Registrar intento de puja 
router.post('/bid/attempt', authRequired, registrarIntentoPuja);

// Obtener estadísticas del usuario autenticado
router.get('/stats', authRequired, obtenerEstadisticas);

// Obtener estadísticas generales (solo admin)
router.get('/admin/general', authRequired, obtenerEstadisticasGenerales);

// Obtener sesiones de un usuario específico (solo admin)
router.get('/admin/user/:userId', authRequired, obtenerSesionesUsuario);

// Exportar datos de analytics (solo admin)
router.get('/admin/export', authRequired, exportarDatos);
router.get('/admin/sessions', authRequired, obtenerTodasLasSesiones);

export default router;
// backend/routes/wins.routes.js
import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { 
  getMyWins, 
  getWinStats,
  getWinDetails 
} from '../controllers/wins.controller.js';

const router = Router();

// Obtener todas mis subastas ganadas
router.get('/my-wins', authRequired, getMyWins);

// Obtener estadísticas de mis victorias
router.get('/my-wins/stats', authRequired, getWinStats);

// Obtener detalles de una victoria específica
router.get('/my-wins/:productId', authRequired, getWinDetails);

export default router;
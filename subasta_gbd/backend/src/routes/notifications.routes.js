// backend/routes/notifications.routes.js
import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../controllers/notifications.controller.js';

const router = Router();

// Obtener notificaciones del usuario (requiere autenticación)
router.get('/notifications', authRequired, getNotifications);

// Marcar una notificación como leída
router.patch('/notifications/:notificationId/read', authRequired, markAsRead);

// Marcar todas las notificaciones como leídas
router.patch('/notifications/read-all', authRequired, markAllAsRead);

// Eliminar una notificación
router.delete('/notifications/:notificationId', authRequired, deleteNotification);

export default router;
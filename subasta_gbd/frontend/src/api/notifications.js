
    import axios from './axios';

// Obtener todas las notificaciones del usuario
export const getNotificationsRequest = () => 
  axios.get('/notifications');  // Ya está en la ruta correcta

// Marcar una notificación como leída
export const   markAsReadRequest = (notificationId) => 
  axios.patch(`/notifications/${notificationId}/read`);  // Ruta correcta según el backend

// Marcar todas las notificaciones como leídas
export const  markAllAsReadRequest = () => 
  axios.patch('/notifications/read-all');  // Ruta correcta según el backend

// Eliminar una notificación
export const deleteNotificationRequest = (notificationId) => 
  axios.delete(`/notifications/${notificationId}`);  // Ruta correcta según el backend

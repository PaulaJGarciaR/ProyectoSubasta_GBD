
    import axios from './axios';

// Obtener todas las notificaciones del usuario
export const getNotificationsRequest = () => 
  axios.get('/notifications');  

// Marcar una notificación como leída
export const   markAsReadRequest = (notificationId) => 
  axios.patch(`/notifications/${notificationId}/read`); 

// Marcar todas las notificaciones como leídas
export const  markAllAsReadRequest = () => 
  axios.patch('/notifications/read-all'); 

// Eliminar una notificación
export const deleteNotificationRequest = (notificationId) => 
  axios.delete(`/notifications/${notificationId}`); 

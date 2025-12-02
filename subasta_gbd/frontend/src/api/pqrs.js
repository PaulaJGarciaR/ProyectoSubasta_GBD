import axios from './axios';

// Crear nueva PQRS
export const createPQRSRequest = (pqrsData) => 
  axios.post('/pqrs', pqrsData);

// Obtener PQRS del usuario
export const getUserPQRSRequest = (params = {}) => 
  axios.get('/pqrs/my', { params });

// Obtener todas las PQRS (Admin)
export const getAllPQRSRequest = (params = {}) => 
  axios.get('/pqrs', { params });

// Obtener PQRS por ID
export const getPQRSByIdRequest = (id) => 
  axios.get(`/pqrs/${id}`);

// Actualizar estado de PQRS (Admin)
export const updatePQRSStatusRequest = (id, data) => 
  axios.put(`/pqrs/${id}/status`, data);

// Responder PQRS como usuario destinatario
export const respondPQRSAsUserRequest = (id, message) => 
  axios.post(`/pqrs/${id}/respond-user`, { message });

// Responder PQRS (Admin)
export const respondPQRSRequest = (id, message) => 
  axios.post(`/pqrs/${id}/respond`, { message });

// Calificar PQRS
export const ratePQRSRequest = (id, rating) => 
  axios.post(`/pqrs/${id}/rate`, rating);

// Obtener estadísticas (Admin)
export const getPQRSStatsRequest = () => 
  axios.get('/pqrs/stats/overview');

// Aceptar PQRS - CORREGIDO: envía un body vacío
export const acceptPQRSRequest = (pqrsId, message = '') => {
  return axios.put(`/pqrs/${pqrsId}/accept`, { message });
};

// Rechazar PQRS
export const rejectPQRSRequest = (pqrsId, reason) => {
  return axios.put(`/pqrs/${pqrsId}/reject`, { reason });
};
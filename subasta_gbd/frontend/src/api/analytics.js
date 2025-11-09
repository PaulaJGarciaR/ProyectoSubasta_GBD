
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const axiosConfig = {
  withCredentials: true 
};

export const createSessionRequest = () => {
  return axios.post(`${API_URL}/analytics/session/create`, {}, axiosConfig);
};

export const closeSessionRequest = (sessionId) => {
  return axios.post(`${API_URL}/analytics/session/close`, { sessionId }, axiosConfig);
};

export const trackCategoryClickRequest = (sessionId, categoria) => {
  return axios.post(`${API_URL}/analytics/category/click`, {
    sessionId,
    categoria
  }, axiosConfig);
};

export const trackBidAttemptRequest = (sessionId, productoId, montoIntentado, exitoso, razonFallo) => {
  return axios.post(`${API_URL}/analytics/bid/attempt`, {
    sessionId,
    productoId,
    montoIntentado,
    exitoso,
    razonFallo
  }, axiosConfig);
};

export const updateSessionTimeRequest = (sessionId, duracionSegundos) => {
  return axios.put(`${API_URL}/analytics/session/time`, {
    sessionId,
    duracionSegundos
  }, axiosConfig);
};

export const getStatsRequest = () => {
  return axios.get(`${API_URL}/analytics/stats`, axiosConfig);
};
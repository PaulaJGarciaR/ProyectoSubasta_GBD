// src/api/wins.js
import axios from './axios';

// Obtener todas mis subastas ganadas
export const getMyWinsRequest = () => 
  axios.get('/my-wins');

// Obtener estadísticas de victorias
export const getWinStatsRequest = () => 
  axios.get('/my-wins/stats');

// Obtener detalles de una victoria específica
export const getWinDetailsRequest = (productId) => 
  axios.get(`/my-wins/${productId}`);
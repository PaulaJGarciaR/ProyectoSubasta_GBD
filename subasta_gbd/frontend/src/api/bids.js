// src/api/bids.js
import axios from './axios';

export const createBidRequest = (productId, amount) => 
  axios.post('/bids', { productId, amount });

export const getBidsByProductRequest = (productId) => 
  axios.get(`/bids/product/${productId}`);

export const getMyBidsRequest = () => 
  axios.get('/my-bids');
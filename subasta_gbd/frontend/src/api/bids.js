// src/api/bids.js
import axios from './axios';

export const createBidRequest = (productId, amount) => 
  axios.post('/bids', { productId, amount });

export const getBidsByProductRequest = (productId) => 
  axios.get(`/bids/product/${productId}`);

export const getMyBidsRequest = () => 
  axios.get('/my-bids');

export const acceptBidRequest = (productId) => 
  axios.post(`/products/${productId}/accept-bid`);

export const cancelAuctionRequest = (productId, reason) => 
  axios.post(`/products/${productId}/cancel`, { reason });
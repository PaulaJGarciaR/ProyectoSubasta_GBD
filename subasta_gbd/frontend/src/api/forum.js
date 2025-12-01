// api/forum.js (ACTUALIZADO)
import axios from './axios';

// Posts
export const createPostRequest = (data) => axios.post('/forum', data);
export const getPostsRequest = (params) => axios.get('/forum', { params });
export const getPostByIdRequest = (id) => axios.get(`/forum/${id}`);
export const updatePostRequest = (id, data) => axios.put(`/forum/${id}`, data);
export const deletePostRequest = (id) => axios.delete(`/forum/${id}`);
export const getMyPostsRequest = () => axios.get('/forum/my-posts');

// Reacciones a posts
export const addReactionToPostRequest = (id, reactionType) => 
  axios.post(`/forum/${id}/react`, { reactionType });
export const removeReactionFromPostRequest = (id) => 
  axios.delete(`/forum/${id}/react`);

// Réplicas (ACTUALIZADO con soporte para réplicas anidadas)
export const addReplyRequest = (id, content, parentReplyId = null, replyingToUserId = null) => 
  axios.post(`/forum/${id}/replies`, { 
    content, 
    parentReplyId, 
    replyingToUserId 
  });

export const deleteReplyRequest = (id, replyId) => 
  axios.delete(`/forum/${id}/replies/${replyId}`);

// Reacciones a réplicas
export const addReactionToReplyRequest = (id, replyId, reactionType) => 
  axios.post(`/forum/${id}/replies/${replyId}/react`, { reactionType });
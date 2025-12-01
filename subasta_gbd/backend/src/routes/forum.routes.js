// routes/forum.routes.js
import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  addReactionToPost,
  removeReactionFromPost,
  addReply,
  deleteReply,
  addReactionToReply
} from '../controllers/forum.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// ============================================
// RUTAS DE POSTS
// ============================================

// Obtener todos los posts (con filtros opcionales)
// GET /api/forum?category=General&page=1&limit=10
router.get('/forum', getPosts);

// Obtener mis posts
// GET /api/forum/my-posts
router.get('/forum/my-posts', authRequired, getMyPosts);

// Obtener un post específico por ID
// GET /api/forum/:id
router.get('/forum/:id', getPostById);

// Crear un nuevo post
// POST /api/forum
router.post('/forum', authRequired, createPost);

// Actualizar un post (solo el autor)
// PUT /api/forum/:id
router.put('/forum/:id', authRequired, updatePost);

// Eliminar un post (solo el autor)
// DELETE /api/forum/:id
router.delete('/forum/:id', authRequired, deletePost);

// ============================================
// RUTAS DE REACCIONES A POSTS
// ============================================

// Agregar o cambiar reacción a un post
// POST /api/forum/:id/react
// Body: { reactionType: 'bien' | 'contento' | 'enojado' | 'triste' }
router.post('/forum/:id/react', authRequired, addReactionToPost);

// Eliminar reacción de un post
// DELETE /api/forum/:id/react
router.delete('/forum/:id/react', authRequired, removeReactionFromPost);

// ============================================
// RUTAS DE RÉPLICAS
// ============================================

// Agregar una réplica a un post
// POST /api/forum/:id/replies
// Body: { content: 'texto de la réplica' }
router.post('/forum/:id/replies', authRequired, addReply);

// Eliminar una réplica (solo el autor de la réplica)
// DELETE /api/forum/:id/replies/:replyId
router.delete('/forum/:id/replies/:replyId', authRequired, deleteReply);

// ============================================
// RUTAS DE REACCIONES A RÉPLICAS
// ============================================

// Agregar o cambiar reacción a una réplica
// POST /api/forum/:id/replies/:replyId/react
// Body: { reactionType: 'bien' | 'contento' | 'enojado' | 'triste' }
router.post('/forum/:id/replies/:replyId/react', authRequired, addReactionToReply);

export default router;
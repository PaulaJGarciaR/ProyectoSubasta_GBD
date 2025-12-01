// controllers/forum.controller.js
import ForumPost from '../models/forumPost.model.js';

// ============================================
// CONTROLADORES DE POSTS
// ============================================

// Crear un nuevo post
export const createPost = async (req, res) => {
  try {
    const { content, image, relatedProduct, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    const newPost = new ForumPost({
      author: req.user.id,
      content: content.trim(),
      image: image || null,
      relatedProduct: relatedProduct || null,
      category: category || 'General'
    });

    await newPost.save();
    
    // Poblar información del autor
    await newPost.populate('author', 'name email username');

    res.status(201).json({
      message: 'Post creado exitosamente',
      post: newPost
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error al crear el post' });
  }
};

// Obtener todos los posts con filtros opcionales
export const getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, isPinned } = req.query;

    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (isPinned !== undefined) {
      filter.isPinned = isPinned === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await ForumPost.find(filter)
      .populate('author', 'name email username')
      .populate('replies.user', 'name email username')
      .populate('reactions.user', 'name email')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error al obtener los posts' });
  }
};

// Obtener un post específico por ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id)
      .populate('author', 'name email username')
      .populate('replies.user', 'name email username')
      .populate('reactions.user', 'name email')
      .populate('relatedProduct', 'name price image');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ message: 'Error al obtener el post' });
  }
};

// Actualizar un post (solo el autor)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image, category } = req.body;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario sea el autor
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este post' });
    }

    if (content !== undefined) post.content = content.trim();
    if (image !== undefined) post.image = image;
    if (category !== undefined) post.category = category;

    await post.save();
    await post.populate('author', 'name email username');

    res.json({
      message: 'Post actualizado exitosamente',
      post
    });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ message: 'Error al actualizar el post' });
  }
};

// Eliminar un post (solo el autor)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario sea el autor
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este post' });
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    // O hard delete si prefieres:
    // await ForumPost.findByIdAndDelete(id);

    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error al eliminar el post' });
  }
};

// Obtener posts del usuario autenticado
export const getMyPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ 
      author: req.user.id,
      isActive: true 
    })
      .populate('author', 'name email username')
      .populate('replies.user', 'name email username')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Error al obtener mis posts:', error);
    res.status(500).json({ message: 'Error al obtener tus posts' });
  }
};

// ============================================
// CONTROLADORES DE REACCIONES A POSTS
// ============================================

// Agregar o cambiar reacción a un post
export const addReactionToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;

    if (!['bien', 'contento', 'enojado', 'triste'].includes(reactionType)) {
      return res.status(400).json({ message: 'Tipo de reacción inválido' });
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.addReaction(req.user.id, reactionType);
    await post.populate('reactions.user', 'name email');

    res.json({
      message: 'Reacción agregada exitosamente',
      reactions: post.reactions,
      reactionCounts: post.getReactionCounts()
    });
  } catch (error) {
    console.error('Error al agregar reacción:', error);
    res.status(500).json({ message: 'Error al agregar la reacción' });
  }
};

// Eliminar reacción de un post
export const removeReactionFromPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.removeReaction(req.user.id);

    res.json({
      message: 'Reacción eliminada exitosamente',
      reactions: post.reactions,
      reactionCounts: post.getReactionCounts()
    });
  } catch (error) {
    console.error('Error al eliminar reacción:', error);
    res.status(500).json({ message: 'Error al eliminar la reacción' });
  }
};

// ============================================
// CONTROLADORES DE RÉPLICAS
// ============================================

// Agregar una réplica a un post (ACTUALIZADO con soporte para réplicas anidadas)
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentReplyId, replyingToUserId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'El contenido de la réplica es requerido' });
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Si es una réplica a otra réplica, verificar que exista la réplica padre
    if (parentReplyId) {
      const parentReply = post.replies.id(parentReplyId);
      if (!parentReply) {
        return res.status(404).json({ message: 'Réplica padre no encontrada' });
      }
    }

    await post.addReply(req.user.id, content.trim(), parentReplyId || null, replyingToUserId || null);
    await post.populate('replies.user', 'name email username');
    await post.populate('replies.replyingTo', 'name email username');

    res.status(201).json({
      message: 'Réplica agregada exitosamente',
      replies: post.replies
    });
  } catch (error) {
    console.error('Error al agregar réplica:', error);
    res.status(500).json({ message: 'Error al agregar la réplica' });
  }
};

// Eliminar una réplica (solo el autor de la réplica)
export const deleteReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Réplica no encontrada' });
    }

    // Verificar que el usuario sea el autor de la réplica
    if (reply.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta réplica' });
    }

    await post.deleteReply(replyId);

    res.json({ message: 'Réplica eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar réplica:', error);
    res.status(500).json({ message: 'Error al eliminar la réplica' });
  }
};

// ============================================
// CONTROLADORES DE REACCIONES A RÉPLICAS
// ============================================

// Agregar o cambiar reacción a una réplica
export const addReactionToReply = async (req, res) => {
  try {
    const { id, replyId } = req.params;
    const { reactionType } = req.body;

    if (!['bien', 'contento', 'enojado', 'triste'].includes(reactionType)) {
      return res.status(400).json({ message: 'Tipo de reacción inválido' });
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.addReactionToReply(replyId, req.user.id, reactionType);
    await post.populate('replies.reactions.user', 'name email');

    const reply = post.replies.id(replyId);

    res.json({
      message: 'Reacción agregada a la réplica exitosamente',
      reactions: reply.reactions
    });
  } catch (error) {
    console.error('Error al agregar reacción a réplica:', error);
    res.status(500).json({ message: error.message || 'Error al agregar la reacción' });
  }
};
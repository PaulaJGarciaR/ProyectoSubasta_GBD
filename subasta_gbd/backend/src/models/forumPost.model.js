// models/forumPost.model.js (ACTUALIZADO)
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bien', 'contento', 'enojado', 'triste'],
    required: true
  }
}, { _id: false });

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  reactions: [reactionSchema],
  // NUEVO: Réplica padre (para réplicas anidadas)
  parentReply: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // NUEVO: Usuario al que se está respondiendo
  replyingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const forumPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  image: {
    type: String,
    default: null
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  category: {
    type: String,
    enum: [
      'General',
      'Consejos',
      'Experiencias',
      'Preguntas',
      'Anuncios',
      'Sugerencias',
      'Problemas',
      'Celebraciones'
    ],
    default: 'General'
  },
  reactions: [reactionSchema],
  replies: [replySchema],
  totalReactions: {
    type: Number,
    default: 0
  },
  totalReplies: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ isPinned: -1, createdAt: -1 });
forumPostSchema.index({ isActive: 1 });

// Método para agregar reacción al post
forumPostSchema.methods.addReaction = function(userId, reactionType) {
  this.reactions = this.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  this.reactions.push({ user: userId, type: reactionType });
  this.totalReactions = this.reactions.length;
  return this.save();
};

// Método para eliminar reacción del post
forumPostSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  this.totalReactions = this.reactions.length;
  return this.save();
};

// Método para agregar réplica (ACTUALIZADO con soporte para réplicas anidadas)
forumPostSchema.methods.addReply = function(userId, content, parentReplyId = null, replyingToUserId = null) {
  const newReply = {
    user: userId,
    content,
    reactions: [],
    parentReply: parentReplyId,
    replyingTo: replyingToUserId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  this.replies.push(newReply);
  this.totalReplies = this.replies.length;
  return this.save();
};

// Método para agregar reacción a una réplica
forumPostSchema.methods.addReactionToReply = function(replyId, userId, reactionType) {
  const reply = this.replies.id(replyId);
  if (!reply) throw new Error('Réplica no encontrada');
  
  reply.reactions = reply.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  reply.reactions.push({ user: userId, type: reactionType });
  reply.updatedAt = new Date();
  return this.save();
};

// Método para eliminar reacción de una réplica
forumPostSchema.methods.removeReactionFromReply = function(replyId, userId) {
  const reply = this.replies.id(replyId);
  if (!reply) throw new Error('Réplica no encontrada');
  
  reply.reactions = reply.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  reply.updatedAt = new Date();
  return this.save();
};

// Método para actualizar réplica
forumPostSchema.methods.updateReply = function(replyId, content) {
  const reply = this.replies.id(replyId);
  if (!reply) throw new Error('Réplica no encontrada');
  
  reply.content = content;
  reply.updatedAt = new Date();
  return this.save();
};

// Método para eliminar réplica
forumPostSchema.methods.deleteReply = function(replyId) {
  this.replies = this.replies.filter(r => r._id.toString() !== replyId.toString());
  this.totalReplies = this.replies.length;
  return this.save();
};

// Método para obtener conteo de reacciones por tipo
forumPostSchema.methods.getReactionCounts = function() {
  const counts = {
    bien: 0,
    contento: 0,
    enojado: 0,
    triste: 0
  };
  
  this.reactions.forEach(reaction => {
    counts[reaction.type]++;
  });
  
  return counts;
};

// Método virtual para obtener la reacción del usuario actual
forumPostSchema.methods.getUserReaction = function(userId) {
  const reaction = this.reactions.find(
    r => r.user.toString() === userId.toString()
  );
  return reaction ? reaction.type : null;
};

export default mongoose.model('ForumPost', forumPostSchema);
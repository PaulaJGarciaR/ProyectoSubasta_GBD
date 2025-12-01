import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Smile,
  Frown,
  Meh,
  Loader2,
  Trash2,
  Filter,
  Reply,
  X
} from 'lucide-react';
import {
  getPostsRequest,
  createPostRequest,
  addReactionToPostRequest,
  removeReactionFromPostRequest,
  addReplyRequest,
  addReactionToReplyRequest,
  deletePostRequest,
  deleteReplyRequest
} from '../api/forum';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const REACTIONS = {
  bien: { icon: ThumbsUp, label: 'Bien' },
  contento: { icon: Smile, label: 'Contento' },
  enojado: { icon: Frown, label: 'Enojado'},
  triste: { icon: Meh, label: 'Triste' }
};

const CATEGORIES = [
  'General',
  'Consejos',
  'Experiencias',
  'Preguntas',
  'Anuncios',
  'Sugerencias',
  'Problemas',
  'Celebraciones'
];

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [filterCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }
      
      const response = await getPostsRequest(params);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error al cargar posts:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las publicaciones',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Swal.fire({
        title: 'Contenido vacío',
        text: 'Por favor escribe algo antes de publicar',
        icon: 'warning',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb'
      });
      return;
    }

    try {
      const postData = {
        content: newPostContent.trim(),
        category: selectedCategory
      };

      if (newPostImage.trim()) {
        postData.image = newPostImage.trim();
      }

      await createPostRequest(postData);

      setNewPostContent('');
      setNewPostImage('');
      setSelectedCategory('General');
      setShowCreatePost(false);

      await Swal.fire({
        title: '¡Publicado!',
        text: 'Tu publicación se ha compartido exitosamente',
        icon: 'success',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
        timer: 1500,
        showConfirmButton: false
      });

      loadPosts();
    } catch (error) {
      console.error('Error al crear post:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear la publicación',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#13171f] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Foro de la Comunidad
          </h1>
          <p className="text-gray-400 mt-2">
            Comparte experiencias, haz preguntas y conecta con otros usuarios
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-[#171d26] rounded-xl p-4 mb-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-semibold">Filtrar por categoría</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterCategory === 'all'
                  ? 'bg-[#fa7942] text-white'
                  : 'bg-[#13171f] text-gray-400 hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-[#fa7942] text-white'
                    : 'bg-[#13171f] text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Crear Post */}
        <div className="bg-[#171d26] rounded-xl p-6 mb-6 border border-gray-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#fa7942] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">
                {user?.name?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            
            {!showCreatePost ? (
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 px-4 py-3 bg-[#13171f] rounded-lg text-left text-gray-400 hover:bg-gray-700 transition-colors"
              >
                ¿Qué estás pensando, {user?.name || user?.username || 'Usuario'}?
              </button>
            ) : (
              <div className="flex-1 space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="¿Qué quieres compartir?"
                  className="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942] min-h-[120px] resize-none"
                  maxLength={5000}
                />

                <input
                  type="text"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder="URL de imagen (opcional)"
                  className="w-full px-4 py-2 bg-[#13171f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePost}
                    className="flex-1 py-3 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Publicar
                  </button>
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPostContent('');
                      setNewPostImage('');
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-[#fa7942] animate-spin mb-4" />
            <p className="text-gray-400">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#171d26] rounded-xl p-12 text-center border border-gray-800">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-gray-500">
              ¡Sé el primero en compartir algo!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onUpdate={loadPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de tarjeta de post
function PostCard({ post, currentUser, onUpdate }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReactions, setShowReactions] = useState(false);

  const isAuthor = post.author._id === currentUser?.id;

  const handleReact = async (reactionType) => {
    try {
      const userReaction = post.reactions.find(
        r => r.user._id === currentUser.id
      );

      if (userReaction && userReaction.type === reactionType) {
        await removeReactionFromPostRequest(post._id);
      } else {
        await addReactionToPostRequest(post._id, reactionType);
      }

      setShowReactions(false);
      onUpdate();
    } catch (error) {
      console.error('Error al reaccionar:', error);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await addReplyRequest(post._id, replyContent.trim());
      setReplyContent('');
      setShowReplyInput(false);
      onUpdate();
    } catch (error) {
      console.error('Error al responder:', error);
    }
  };

  const handleDeletePost = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#171d26',
      color: '#f7f9fb'
    });

    if (result.isConfirmed) {
      try {
        await deletePostRequest(post._id);
        onUpdate();
      } catch (error) {
        console.error('Error al eliminar post:', error);
      }
    }
  };

  const getReactionCounts = () => {
    const counts = {
      bien: 0,
      contento: 0,
      enojado: 0,
      triste: 0
    };

    post.reactions.forEach(r => {
      counts[r.type]++;
    });

    return counts;
  };

  const reactionCounts = getReactionCounts();
  const totalReactions = post.reactions.length;
  const userReaction = post.reactions.find(r => r.user._id === currentUser?.id);

  // Organizar réplicas en estructura jerárquica
  const organizeReplies = () => {
    const topLevelReplies = post.replies.filter(r => !r.parentReply);
    return topLevelReplies;
  };

  const getNestedReplies = (parentId) => {
    return post.replies.filter(r => r.parentReply?.toString() === parentId.toString());
  };

  return (
    <div className="bg-[#171d26] rounded-xl p-6 border border-gray-800">
      {/* Header del post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#fa7942] rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {post.author.name?.[0] || post.author.email?.[0]}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {post.author.name || post.author.username || post.author.email}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#fa7942]/20 text-[#fa7942] rounded">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {isAuthor && (
          <button
            onClick={handleDeletePost}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>

      {/* Contenido del post */}
      <p className="text-white mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Imagen del post */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg mb-4 max-h-96 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Contador de reacciones y réplicas */}
      <div className="flex items-center justify-between py-3 border-t border-gray-800">
        <div className="flex items-center gap-4">
          {totalReactions > 0 && (
            <div className="flex items-center gap-2">
              {Object.entries(reactionCounts).map(([type, count]) => {
                if (count === 0) return null;
                const ReactionIcon = REACTIONS[type].icon;
                return (
                  <div key={type} className="flex items-center gap-1">
                    <ReactionIcon className={`w-4 h-4 ${REACTIONS[type].color}`} />
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {post.totalReplies} {post.totalReplies === 1 ? 'respuesta' : 'respuestas'}
        </span>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 py-3 border-t border-gray-800">
        <div className="relative flex-1">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              userReaction
                ? `${REACTIONS[userReaction.type].color} bg-${userReaction.type === 'bien' ? 'blue' : userReaction.type === 'contento' ? 'yellow' : userReaction.type === 'enojado' ? 'red' : 'gray'}-500/10`
                : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {userReaction ? (
              <>
                {React.createElement(REACTIONS[userReaction.type].icon, { className: 'w-5 h-5' })}
                {REACTIONS[userReaction.type].label}
              </>
            ) : (
              <>
                <ThumbsUp className="w-5 h-5" />
                Reaccionar
              </>
            )}
          </button>

          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#13171f] border border-gray-700 rounded-lg p-2 flex gap-2 shadow-xl z-10">
              {Object.entries(REACTIONS).map(([type, { icon: Icon, label, color }]) => (
                <button
                  key={type}
                  onClick={() => handleReact(type)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title={label}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="flex-1 py-2 text-gray-400 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Responder
        </button>
      </div>

      {/* Input de réplica */}
      {showReplyInput && (
        <div className="mt-4 flex gap-3">
          <div className="w-8 h-8 bg-[#fa7942] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {currentUser?.name?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe una respuesta..."
              className="flex-1 px-4 py-2 bg-[#13171f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              maxLength={1000}
            />
            <button
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-[#fa7942] hover:bg-[#ff9365] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Réplicas */}
      {post.replies && post.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {organizeReplies().map(reply => (
            <ReplyCard
              key={reply._id}
              reply={reply}
              postId={post._id}
              currentUser={currentUser}
              onUpdate={onUpdate}
              allReplies={post.replies}
              getNestedReplies={getNestedReplies}
              level={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de réplica (ACTUALIZADO con soporte para réplicas anidadas)
function ReplyCard({ reply, postId, currentUser, onUpdate, allReplies, getNestedReplies, level = 0 }) {
  const [showReactions, setShowReactions] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  const isAuthor = reply.user._id === currentUser?.id;
  const nestedReplies = getNestedReplies(reply._id);
  const maxNestingLevel = 3; // Máximo nivel de anidamiento

  const handleReact = async (reactionType) => {
    try {
      await addReactionToReplyRequest(postId, reply._id, reactionType);
      setShowReactions(false);
      onUpdate();
    } catch (error) {
      console.error('Error al reaccionar a réplica:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReplyRequest(postId, reply._id);
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar réplica:', error);
    }
  };

  const handleReplyToReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await addReplyRequest(
        postId, 
        replyContent.trim(), 
        reply._id, // parentReplyId
        reply.user._id // replyingToUserId
      );
      setReplyContent('');
      setShowReplyInput(false);
      onUpdate();
    } catch (error) {
      console.error('Error al responder:', error);
    }
  };

  const userReaction = reply.reactions?.find(r => r.user._id === currentUser?.id);

  return (
    <div className={`${level > 0 ? 'ml-8 mt-3' : ''}`}>
      <div className="bg-[#13171f] rounded-lg p-4 border-l-2 border-[#fa7942]/30">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-[#fa7942] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {reply.user.name?.[0] || reply.user.email?.[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-sm font-semibold">
                  {reply.user.name || reply.user.username || reply.user.email}
                </span>
                {reply.replyingTo && (
                  <>
                    <Reply className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-400">
                      {reply.replyingTo.name || reply.replyingTo.username || reply.replyingTo.email}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {isAuthor && (
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>

        <p className="text-gray-300 text-sm mb-3">{reply.content}</p>

        {/* Reacciones y botón de responder */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                userReaction
                  ? `${REACTIONS[userReaction.type].color}`
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {userReaction ? (
                React.createElement(REACTIONS[userReaction.type].icon, { className: 'w-4 h-4' })
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#171d26] border border-gray-700 rounded-lg p-1 flex gap-1 shadow-xl z-10">
                {Object.entries(REACTIONS).map(([type, { icon: Icon, color }]) => (
                  <button
                    key={type}
                    onClick={() => handleReact(type)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {reply.reactions && reply.reactions.length > 0 && (
            <span className="text-xs text-gray-400">
              {reply.reactions.length} {reply.reactions.length === 1 ? 'reacción' : 'reacciones'}
            </span>
          )}

          {/* Botón de responder solo si no hemos alcanzado el nivel máximo */}
          {level < maxNestingLevel && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-gray-400 hover:text-[#fa7942] transition-colors flex items-center gap-1"
            >
              <Reply className="w-4 h-4" />
              Responder
            </button>
          )}
        </div>

        {/* Input para responder a esta réplica */}
        {showReplyInput && (
          <div className="mt-3 flex gap-2">
            <div className="w-6 h-6 bg-[#fa7942] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {currentUser?.name?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Responder a ${reply.user.name || reply.user.username || 'usuario'}...`}
                className="flex-1 px-3 py-1.5 text-sm bg-[#171d26] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                onKeyPress={(e) => e.key === 'Enter' && handleReplyToReply()}
                maxLength={1000}
              />
              <button
                onClick={handleReplyToReply}
                disabled={!replyContent.trim()}
                className="px-3 py-1.5 bg-[#fa7942] hover:bg-[#ff9365] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Réplicas anidadas */}
      {nestedReplies.length > 0 && (
        <div className="space-y-3">
          {nestedReplies.map(nestedReply => (
            <ReplyCard
              key={nestedReply._id}
              reply={nestedReply}
              postId={postId}
              currentUser={currentUser}
              onUpdate={onUpdate}
              allReplies={allReplies}
              getNestedReplies={getNestedReplies}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
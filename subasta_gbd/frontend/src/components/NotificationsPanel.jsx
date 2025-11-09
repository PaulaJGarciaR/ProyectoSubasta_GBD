import { useState, useEffect } from 'react';
import { X, Check, Trash2, Bell, Loader2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { 
  getNotificationsRequest, 
  markAsReadRequest, 
  markAllAsReadRequest,
  deleteNotificationRequest 
} from '../api/notifications';
import Swal from 'sweetalert2';

export default function NotificationsPanel({ isOpen, onClose }) {
  const { notifications: realtimeNotifications, setNotifications, setUnreadCount } = useSocket();
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, filter]);

  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      setAllNotifications(prev => {
        const newNotifs = realtimeNotifications.filter(
          newNotif => !prev.some(existing => existing._id === newNotif._id)
        );
        return [...newNotifs, ...prev];
      });
    }
  }, [realtimeNotifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'unread' ? { unreadOnly: true } : {};
      const response = await getNotificationsRequest(params);
      setAllNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsReadRequest(notificationId);
      setAllNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadRequest();
      setAllNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      
      Swal.fire({
        title: '¡Listo!',
        text: 'Todas las notificaciones marcadas como leídas',
        icon: 'success',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar notificación?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#fa7942',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#171d26',
        color: '#f7f9fb'
      });

      if (result.isConfirmed) {
        await deleteNotificationRequest(notificationId);
        setAllNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        Swal.fire({
          title: 'Eliminada',
          text: 'Notificación eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#fa7942',
          background: '#171d26',
          color: '#f7f9fb',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_bid':
        return '⚒︎';
      case 'outbid':
        return '△';
      case 'auction_won':
        return '★';
      case 'auction_end':
        return '⏱︎';
      default:
        return '‼';
    }
  };

  const formatNotificationMessage = (notification) => {
    if (notification.sender) {
    const userName = notification.sender.username || notification.sender.email || 'Un usuario';
      return notification.message.replace('Un usuario', userName);
    }
    return notification.message;
  };

  const getProductImage = (notification) => {
    if (!notification.product) return null;
    
    if (typeof notification.product.image === 'string') {
      return notification.product.image;
    }
    
    // Si product tiene un array de images
    if (notification.product.images && notification.product.images.length > 0) {
      return notification.product.images[0];
    }
    
    return null;
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifDate.toLocaleDateString('es-ES');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-end p-4">
      <div className="bg-[#171d26] rounded-xl w-full max-w-md h-[90vh] flex flex-col shadow-2xl border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#fa7942]" />
            <h2 className="text-xl font-bold text-white">Notificaciones</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-700 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#fa7942] text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-[#fa7942] text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="ml-auto px-3 py-2 text-sm text-[#fa7942] hover:bg-slate-700 rounded-lg transition-colors"
          >
            Marcar todas
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 text-[#fa7942] animate-spin" />
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bell className="w-16 h-16 mb-4 opacity-50" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {allNotifications.map((notification) => {
                const productImage = getProductImage(notification);
                
                return (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-slate-700/50 transition-colors ${
                      !notification.read ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm mb-1">
                          {formatNotificationMessage(notification)}
                        </p>
                        
                        {notification.product && (
                          <div className="flex items-center gap-2 mb-2">
                            {productImage && (
                              <img
                                src={productImage}
                                alt={notification.product.title || 'Producto'}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <p className="text-xs text-gray-400 truncate">
                              {notification.product.title || 'Producto'}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.bidAmount && (
                            <span className="text-[#fa7942] font-medium">
                              ${notification.bidAmount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
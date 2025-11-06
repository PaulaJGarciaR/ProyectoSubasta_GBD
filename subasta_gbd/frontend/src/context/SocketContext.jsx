// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Crear conexión con Socket.IO
    const newSocket = io('http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket conectado:', newSocket.id);
      setConnected(true);
      
      // Registrar usuario con su ID
      if (user?.id) {
        newSocket.emit('register_user', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
      setConnected(false);
    });

    // Escuchar nuevas notificaciones
    newSocket.on('new_notification', (data) => {
      console.log('Nueva notificación recibida:', data);
      
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Mostrar notificación del navegador si está permitido
      if (Notification.permission === 'granted') {
        new Notification('Nueva notificación', {
          body: data.notification.message,
          icon: '/logo.png'
        });
      }
    });

    // Escuchar actualizaciones de productos
    newSocket.on('product_updated', (data) => {
      console.log('Producto actualizado:', data);
    });

    // ⭐ NUEVO: Escuchar cuando ganas una subasta
    newSocket.on('auction_won', (data) => {
      console.log('🎉 ¡Has ganado una subasta!', data);
      
      // Mostrar notificación especial de victoria
      if (Notification.permission === 'granted') {
        new Notification('🏆 ¡Felicidades! Has ganado', {
          body: `Ganaste: ${data.productTitle} por ${data.finalPrice.toLocaleString()}`,
          icon: '/trophy.png',
          badge: '/trophy.png'
        });
      }

      // También mostrar SweetAlert
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '🏆 ¡Felicidades!',
          html: `
            <p class="text-lg mb-2">Has ganado la subasta de:</p>
            <p class="text-2xl font-bold text-green-400">${data.productTitle}</p>
            <p class="text-xl mt-3">Precio final: <span class="text-green-400">${data.finalPrice.toLocaleString()}</span></p>
          `,
          icon: 'success',
          confirmButtonColor: '#22c55e',
          background: '#171d26',
          color: '#f7f9fb',
          timer: 5000
        });
      }
    });

    // ⭐ NUEVO: Escuchar cuando se cierra una subasta
    newSocket.on('auction_closed', (data) => {
      console.log('Subasta cerrada:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Solicitar permiso para notificaciones del navegador
  useEffect(() => {
    if (isAuthenticated && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

  const value = {
    socket,
    connected,
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
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
      // Aquí puedes actualizar el estado de productos si es necesario
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
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.route.js';
import bidsRoutes from './routes/bids.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import winsRoutes from './routes/wins.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.set('io', io);

// Rutas
app.use("/api", authRoutes);
app.use("/api", productsRoutes);
app.use("/api", bidsRoutes);
app.use("/api", notificationsRoutes);
app.use("/api", winsRoutes); // ← ESTA LÍNEA FALTABA
app.use('/api/analytics', analyticsRoutes);

// Socket.IO - Manejo de conexiones
const connectedUsers = new Map(); 

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Cuando un usuario se registra con su ID
  socket.on('register_user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
    console.log(`Total usuarios conectados: ${connectedUsers.size}`);
  });

  // Desconexión
  socket.on('disconnect', () => {
    // Eliminar usuario de la lista
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`Usuario ${userId} desconectado`);
        console.log(`Total usuarios conectados: ${connectedUsers.size}`);
        break;
      }
    }
  });
});

// Exportar para usar en controladores
export { io, connectedUsers };
export default httpServer;
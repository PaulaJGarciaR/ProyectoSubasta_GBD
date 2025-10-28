// backend/index.js
import httpServer from './app.js'; // Cambio: importar httpServer en lugar de app
import { connectDB } from './db.js';

connectDB();

httpServer.listen(4000); // Cambio: usar httpServer en lugar de app
console.log('🚀 ================================');
console.log('🚀 Serve on port', 4000);
console.log('🔌 Socket.IO habilitado');
console.log('🚀 ================================');
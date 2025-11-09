import httpServer from './app.js';
import { connectDB } from './db.js';

connectDB();

httpServer.listen(4000); 
console.log('Serve on port', 4000);
console.log('Socket.IO habilitado');

import AnalyticsSession from '../models/AnalyticsSession.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.model.js'


export const createSession = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      console.error(' No se pudo obtener userId de req.user:', req.user);
      return res.status(400).json({ message: 'Usuario no identificado' });
    }
    
    console.log('Creando sesión para usuario:', userId);
    const usuario = await User.findById(userId).select('email firstName lastName country state city');
    
    if (!usuario) {
      console.error(' Usuario no encontrado:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const sesionesActivas = await AnalyticsSession.updateMany(
      { 
        userId,
        'tiempoSesion.activa': true 
      },
      { 
        $set: { 
          'tiempoSesion.activa': false,
          'tiempoSesion.fin': new Date()
        }
      }
    );
    
    if (sesionesActivas.modifiedCount > 0) {
      console.log(`🔒 ${sesionesActivas.modifiedCount} sesión(es) anterior(es) cerrada(s)`);
    }
    
    const sessionId = uuidv4();
    const ahora = new Date();
    
    const nuevaSesion = new AnalyticsSession({
      userId,
      sessionId,
      ubicacion: {
        ip: req.ip || req.connection?.remoteAddress || '::1',
        navegador: req.headers['user-agent'] || 'Desconocido',
        sistemaOperativo: detectarSO(req.headers['user-agent']),
        pais: usuario.country || 'No especificado',
        departamento: usuario.state || 'No especificado',
        ciudad: usuario.city || 'No especificado'
      },
      tiempoSesion: {
        inicio: ahora,
        duracionSegundos: 0,
        fin: null,
        activa: true
      },
      fechaIngreso: {
        hora: ahora.getHours(),
        dia: ahora.getDate(),
        mes: ahora.getMonth() + 1,
        año: ahora.getFullYear(),
        diaSemana: obtenerDiaSemana(ahora),
        timestamp: ahora
      },
      interacciones: {
        busquedas: [],
        filtrosUsados: [],
        productosVistos: []
      },
      categoriasClicadas: [],
      intentosPuja: [],
      paginasVistas: []
    });
    
    await nuevaSesion.save();
    
    console.log('Sesión creada:', sessionId);
    console.log('Ubicación del usuario:', {
      pais: usuario.country,
      departamento: usuario.state,
      ciudad: usuario.city
    });
    
    console.log('Sesión creada:', sessionId);
    
    res.status(201).json({ 
      message: 'Sesión de analytics iniciada',
      sessionId,
      userId
    });
    
  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({ 
      message: 'Error al crear sesión de analytics',
      error: error.message 
    });
  }
};

export const validarSesion = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!sessionId) {
      return res.status(400).json({ 
        valida: false, 
        message: 'sessionId es requerido' 
      });
    }
    
    const session = await AnalyticsSession.findOne({ 
      sessionId,
      userId,
      'tiempoSesion.activa': true 
    });
    
    if (!session) {
      return res.json({ 
        valida: false, 
        message: 'Sesión no encontrada o inactiva' 
      });
    }
    
    res.json({ 
      valida: true,
      sessionId,
      duracionSegundos: session.tiempoSesion.duracionSegundos
    });
    
  } catch (error) {
    console.error('❌ Error validando sesión:', error);
    res.status(500).json({ 
      valida: false,
      message: 'Error al validar sesión',
      error: error.message 
    });
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId es requerido' });
    }
    
    console.log('Cerrando sesión:', sessionId, 'Usuario:', userId);
    
    const session = await AnalyticsSession.findOne({ 
      sessionId,
      userId 
    });
    
    if (!session) {
      console.log('Sesión no encontrada:', sessionId);
      return res.json({ 
        message: 'Sesión no encontrada o ya cerrada',
        sessionId 
      });
    }
    
    if (!session.tiempoSesion.activa) {
      console.log('Sesión ya estaba cerrada');
      return res.json({ 
        message: 'Sesión ya estaba cerrada',
        duracion: session.tiempoSesion.duracionSegundos 
      });
    }

    const ahora = new Date();
    const duracionTotal = Math.floor((ahora - session.tiempoSesion.inicio) / 1000);
    
    session.tiempoSesion.fin = ahora;
    session.tiempoSesion.duracionSegundos = Math.max(session.tiempoSesion.duracionSegundos, duracionTotal);
    session.tiempoSesion.activa = false;
    
    await session.save();
    
    console.log(`Sesión cerrada: ${sessionId} | Duración: ${duracionTotal}s (${Math.floor(duracionTotal/60)} min)`);
    
    res.json({ 
      message: 'Sesión cerrada exitosamente',
      sessionId,
      duracion: session.tiempoSesion.duracionSegundos,
      duracionMinutos: Math.floor(session.tiempoSesion.duracionSegundos / 60)
    });
    
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    res.status(500).json({ 
      message: 'Error al cerrar sesión',
      error: error.message 
    });
  }
};

export const registrarCategoriaClick = async (req, res) => {
  try {
    const { sessionId, categoria } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!sessionId || !categoria) {
      return res.status(400).json({ message: 'sessionId y categoria son requeridos' });
    }
    
    console.log('Registrando categoría:', categoria, 'Sesión:', sessionId);
    
    const session = await AnalyticsSession.findOne({ 
      sessionId, 
      userId 
    });
    
    if (!session) {
      console.log('Sesión no encontrada:', sessionId);
      return res.status(404).json({ 
        message: 'Sesión no encontrada. Por favor, recarga la página.' 
      });
    }
    
    const categoriaExistente = session.categoriasClicadas.find(
      c => c.categoria === categoria
    );
    
    if (categoriaExistente) {
      // Incrementar clicks
      categoriaExistente.clicks = (categoriaExistente.clicks || 1) + 1;
      categoriaExistente.timestamp = new Date();
    } else {
      // Agregar nueva categoría
      session.categoriasClicadas.push({
        categoria,
        clicks: 1,
        timestamp: new Date()
      });
    }
    
    await session.save();
    
    console.log(`Categoría "${categoria}" registrada en sesión ${sessionId}`);
    
    res.json({ 
      message: 'Categoría registrada',
      categoria,
      totalClicks: categoriaExistente ? categoriaExistente.clicks : 1
    });
    
  } catch (error) {
    console.error('Error registrando categoría:', error);
    res.status(500).json({ 
      message: 'Error al registrar categoría',
      error: error.message 
    });
  }
};

export const registrarIntentoPuja = async (req, res) => {
  try {
    const { sessionId, productoId, montoIntentado, exitoso, razonFallo } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!sessionId || !productoId || montoIntentado === undefined || exitoso === undefined) {
      return res.status(400).json({ 
        message: 'sessionId, productoId, montoIntentado y exitoso son requeridos' 
      });
    }
    
    const session = await AnalyticsSession.findOne({ sessionId, userId });
    
    if (!session) {
      console.log('Sesión no encontrada para puja:', sessionId);
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    
    //Agregar intento de puja
    session.intentosPuja.push({
      productoId,
      montoIntentado,
      exitoso,
      razonFallo: exitoso ? null : razonFallo,
      timestamp: new Date()
    });
    
    await session.save();
    
    console.log(`Puja ${exitoso ? 'EXITOSA' : 'FALLIDA'} registrada: $${montoIntentado} | Producto: ${productoId}`);
    
    res.json({ 
      message: 'Intento de puja registrado',
      exitoso,
      totalPujas: session.intentosPuja.length
    });
    
  } catch (error) {
    console.error('Error registrando puja:', error);
    res.status(500).json({ 
      message: 'Error al registrar puja',
      error: error.message 
    });
  }
};

export const actualizarTiempoSesion = async (req, res) => {
  try {
    const { sessionId, duracionSegundos } = req.body;
    const userId = req.user.id || req.user._id;
    
    if (!sessionId || duracionSegundos === undefined) {
      return res.status(400).json({ 
        message: 'sessionId y duracionSegundos son requeridos' 
      });
    }
    
    const session = await AnalyticsSession.findOne({ sessionId, userId });
    
    if (!session) {
      console.log('Sesión no encontrada para actualizar tiempo:', sessionId);
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    
    if (!session.tiempoSesion.activa) {
      return res.json({ 
        message: 'Sesión inactiva, no se actualiza duración',
        duracionSegundos: session.tiempoSesion.duracionSegundos
      });
    }
    
    session.tiempoSesion.duracionSegundos = duracionSegundos;
    
    await session.save();
    
    res.json({ 
      message: 'Tiempo de sesión actualizado',
      duracionSegundos,
      duracionMinutos: Math.floor(duracionSegundos / 60)
    });
    
  } catch (error) {
    console.error('Error actualizando tiempo:', error);
    res.status(500).json({ 
      message: 'Error al actualizar tiempo',
      error: error.message 
    });
  }
};
 
export const obtenerEstadisticas = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    const estadisticas = await AnalyticsSession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$userId',
          totalSesiones: { $sum: 1 },
          tiempoTotalSegundos: { $sum: '$tiempoSesion.duracionSegundos' },
          totalPujas: { $sum: { $size: '$intentosPuja' } },
          pujasExitosas: {
            $sum: {
              $size: {
                $filter: {
                  input: '$intentosPuja',
                  as: 'puja',
                  cond: { $eq: ['$$puja.exitoso', true] }
                }
              }
            }
          },
          categoriasVisitadas: { $push: '$categoriasClicadas.categoria' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSesiones: 1,
          tiempoTotalHoras: { $round: [{ $divide: ['$tiempoTotalSegundos', 3600] }, 2] },
          tiempoPromedioMinutos: { 
            $round: [
              { 
                $divide: [
                  { $divide: ['$tiempoTotalSegundos', '$totalSesiones'] },
                  60
                ]
              },
              1
            ]
          },
          totalPujas: 1,
          pujasExitosas: 1,
          tasaExito: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalPujas', 0] },
                  { $multiply: [{ $divide: ['$pujasExitosas', '$totalPujas'] }, 100] },
                  0
                ]
              },
              1
            ]
          }
        }
      }
    ]);
    
    res.json({
      message: 'Estadísticas obtenidas',
      data: estadisticas[0] || {
        totalSesiones: 0,
        tiempoTotalHoras: 0,
        tiempoPromedioMinutos: 0,
        totalPujas: 0,
        pujasExitosas: 0,
        tasaExito: 0
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

export const obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const estadisticas = await AnalyticsSession.aggregate([
      {
        $group: {
          _id: null,
          totalSesiones: { $sum: 1 },
          usuariosUnicos: { $addToSet: '$userId' },
          tiempoPromedioSegundos: { $avg: '$tiempoSesion.duracionSegundos' },
          totalPujas: { $sum: { $size: '$intentosPuja' } },
          totalCategorias: { $sum: { $size: '$categoriasClicadas' } }
        }
      },
      {
        $project: {
          _id: 0,
          totalSesiones: 1,
          usuariosUnicos: { $size: '$usuariosUnicos' },
          tiempoPromedioMinutos: { $round: [{ $divide: ['$tiempoPromedioSegundos', 60] }, 1] },
          totalPujas: 1,
          totalCategorias: 1
        }
      }
    ]);
    
    res.json({
      message: 'Estadísticas generales obtenidas',
      data: estadisticas[0] || {
        totalSesiones: 0,
        usuariosUnicos: 0,
        tiempoPromedioMinutos: 0,
        totalPujas: 0,
        totalCategorias: 0
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas generales:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

export const obtenerSesionesUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sesiones = await AnalyticsSession.find({ userId })
      .sort({ 'tiempoSesion.inicio': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AnalyticsSession.countDocuments({ userId });
    
    res.json({
      message: 'Sesiones obtenidas',
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: sesiones
    });
    
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({ 
      message: 'Error al obtener sesiones',
      error: error.message 
    });
  }
};

export const exportarDatos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, formato = 'json' } = req.query;
    
    const query = {};
    
    if (fechaInicio && fechaFin) {
      query['fechaIngreso.timestamp'] = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    
    const sesiones = await AnalyticsSession.find(query)
      .populate('userId', 'email nombre')
      .sort({ 'tiempoSesion.inicio': -1 })
      .lean();
    
    // Si se requiere CSV, convertir
    if (formato === 'csv') {
      const csv = convertirACSV(sesiones);
      res.header('Content-Type', 'text/csv');
      res.attachment(`analytics-${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.json({
      message: 'Datos exportados',
      total: sesiones.length,
      fechaExportacion: new Date(),
      filtros: { fechaInicio, fechaFin },
      data: sesiones
    });
    
  } catch (error) {
    console.error('Error exportando datos:', error);
    res.status(500).json({ 
      message: 'Error al exportar datos',
      error: error.message 
    });
  }
};

function detectarSO(userAgent) {
  if (!userAgent) return 'Desconocido';
  
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone')) return 'iOS';
  
  return 'Desconocido';
}

function obtenerDiaSemana(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fecha.getDay()];
}

export const obtenerTodasLasSesiones = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sesiones = await AnalyticsSession.find()
      .populate('userId', 'email firstName lastName country state city _id')
      .sort({ 'tiempoSesion.inicio': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await AnalyticsSession.countDocuments();
    
    res.json({
      message: 'Sesiones obtenidas',
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: sesiones
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error al obtener sesiones',
      error: error.message 
    });
  }
};
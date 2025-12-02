import PQRS from '../models/pqrs.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

// Crear nueva PQRS
export const createPQRS = async (req, res) => {
  try {
    const {
      toUserId,
      type,
      category,
      subject,
      description,
      productId,
      bidId,
      priority,
      isAnonymous
    } = req.body;

    // Validar campos requeridos
    if (!toUserId || !type || !category || !subject || !description || !productId) {
      return res.status(400).json({
        message: 'Campos obligatorios: destinatario, tipo, categoría, asunto, descripción y producto'
      });
    }

    // Validar que no se cree PQRS contra sí mismo
    if (toUserId === req.user.id) {
      return res.status(400).json({
        message: 'No puedes crear una PQRS contra ti mismo'
      });
    }

    // Verificar que el usuario destinatario exista
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: 'El usuario destinatario no existe'
      });
    }

    // Verificar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'El producto no existe'
      });
    }

    // Crear nueva PQRS con anonimato simplificado
    const newPQRS = new PQRS({
      fromUser: req.user.id,
      toUser: toUserId,
      type,
      category,
      subject,
      description,
      productId,
      bidId: bidId || null,
      priority: priority || 'Media',
      isAnonymous: isAnonymous || false
    });

    // Agregar al historial
    newPQRS.addHistory(
      'Creada', 
      req.user.id, 
      'creator',
      isAnonymous ? 'PQRS anónima creada' : `PQRS creada contra ${toUser.name}`
    );

    await newPQRS.save();

    // Poblar información
    const populatedPQRS = await PQRS.findById(newPQRS._id)
      .populate('fromUser', 'name email role')
      .populate('toUser', 'name email role')
      .populate('productId', 'title image');

    // Aplicar anonimato en la respuesta
    const pqrsObj = populatedPQRS.toObject();
    pqrsObj.fromUser = populatedPQRS.getAnonymizedFromUser(req.user.id);

    res.status(201).json({
      message: 'PQRS creada exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al crear PQRS:', error);
    res.status(500).json({
      message: 'Error al crear PQRS',
      error: error.message
    });
  }
};

// Obtener todas las PQRS del usuario (enviadas y recibidas)
export const getUserPQRS = async (req, res) => {
  try {
    const { status, type, direction } = req.query;
    
    let query = {};
    
    // direction: 'sent' (enviadas), 'received' (recibidas), o ambas
    if (direction === 'sent') {
      query.fromUser = req.user.id;
    } else if (direction === 'received') {
      query.toUser = req.user.id;
    } else {
      query.$or = [
        { fromUser: req.user.id },
        { toUser: req.user.id }
      ];
    }
    
    if (status) query.status = status;
    if (type) query.type = type;

    const pqrsList = await PQRS.find(query)
      .populate('fromUser', 'name email role')
      .populate('toUser', 'name email role')
      .populate('productId', 'title image')
      .populate('adminResponse.respondedBy', 'name email')
      .sort({ createdAt: -1 });

    // Aplicar anonimato a todas las PQRS
    const filteredPQRS = pqrsList.map(pqrs => {
      const pqrsObj = pqrs.toObject();
      
      // Si es anónima, ocultar siempre (excepto si el usuario actual es el creador)
      if (pqrs.isAnonymous && !pqrs.isCreator(req.user.id)) {
        pqrsObj.fromUser = pqrs.getAnonymizedFromUser(req.user.id);
      }
      
      return pqrsObj;
    });

    res.json({
      message: 'PQRS obtenidas exitosamente',
      pqrs: filteredPQRS,
      total: filteredPQRS.length
    });
  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    res.status(500).json({
      message: 'Error al obtener PQRS',
      error: error.message
    });
  }
};

// Obtener PQRS por ID
export const getPQRSById = async (req, res) => {
  try {
    const { id } = req.params;

    const pqrs = await PQRS.findById(id)
      .populate('fromUser', 'name email role')
      .populate('toUser', 'name email role')
      .populate('productId', 'title image currentPrice')
      .populate('adminResponse.respondedBy', 'name email')
      .populate('history.performedBy', 'name email');

    if (!pqrs) {
      return res.status(404).json({
        message: 'PQRS no encontrada'
      });
    }

    // Verificar permisos: solo el creador, el destinatario o admin pueden verla
    if (
      req.user.role !== 'admin' && 
      pqrs.fromUser._id.toString() !== req.user.id &&
      pqrs.toUser._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'No tienes permiso para ver esta PQRS'
      });
    }

    // Aplicar anonimato (excepto si es el creador)
    const pqrsObj = pqrs.toObject();
    if (pqrs.isAnonymous && !pqrs.isCreator(req.user.id)) {
      pqrsObj.fromUser = pqrs.getAnonymizedFromUser(req.user.id);
      
      // También ocultar en el historial
      pqrsObj.history = pqrsObj.history.map(h => {
        if (h.performedByRole === 'creator') {
          return {
            ...h,
            performedBy: {
              _id: null,
              name: 'Usuario Anónimo',
              email: 'anonimo@sistema.com'
            }
          };
        }
        return h;
      });
    }

    res.json({
      message: 'PQRS obtenida exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    res.status(500).json({
      message: 'Error al obtener PQRS',
      error: error.message
    });
  }
};

// Aceptar PQRS (destinatario)
export const acceptPQRS = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({ message: 'PQRS no encontrada' });
    }

    // Verificar que el usuario sea el destinatario
    if (pqrs.toUser.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Solo el destinatario puede aceptar esta PQRS' 
      });
    }

    // Validar transición de estado
    if (!pqrs.canTransitionTo('Aceptada', 'user')) {
      return res.status(400).json({ 
        message: `No se puede aceptar una PQRS en estado "${pqrs.status}"` 
      });
    }

    const oldStatus = pqrs.status;
    pqrs.status = 'Aceptada';
    pqrs.acceptedAt = new Date();
    
    if (message && message.trim()) {
      pqrs.recipientResponse = {
        message: message.trim(),
        respondedAt: new Date(),
        accepted: true
      };
    }

    pqrs.addHistory(
      'PQRS Aceptada',
      userId,
      'recipient',
      `Destinatario aceptó la PQRS${message ? ' con mensaje' : ''}`,
      oldStatus,
      'Aceptada'
    );
    
    await pqrs.save();

    // Poblar datos después de guardar
    const populatedPQRS = await PQRS.findById(id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('productId', 'title');

    // Aplicar anonimato
    const pqrsObj = populatedPQRS.toObject();
    if (populatedPQRS.isAnonymous && !populatedPQRS.isCreator(userId)) {
      pqrsObj.fromUser = populatedPQRS.getAnonymizedFromUser(userId);
    }

    res.json({
      message: 'PQRS aceptada exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al aceptar PQRS:', error);
    res.status(500).json({ 
      message: 'Error al aceptar la PQRS',
      error: error.message 
    });
  }
};

// Rechazar PQRS (destinatario)
export const rejectPQRS = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ 
        message: 'El motivo de rechazo es obligatorio' 
      });
    }

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({ message: 'PQRS no encontrada' });
    }

    if (pqrs.toUser.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Solo el destinatario puede rechazar esta PQRS' 
      });
    }

    if (!pqrs.canTransitionTo('Rechazada', 'user')) {
      return res.status(400).json({ 
        message: `No se puede rechazar una PQRS en estado "${pqrs.status}"` 
      });
    }

    const oldStatus = pqrs.status;
    pqrs.status = 'Rechazada';
    pqrs.rejectionReason = reason.trim();
    pqrs.rejectedAt = new Date();
    
    pqrs.recipientResponse = {
      message: reason.trim(),
      respondedAt: new Date(),
      accepted: false
    };

    pqrs.addHistory(
      'PQRS Rechazada',
      userId,
      'recipient',
      `Destinatario rechazó la PQRS: ${reason.substring(0, 100)}`,
      oldStatus,
      'Rechazada'
    );
    
    await pqrs.save();

    // Poblar datos después de guardar
    const populatedPQRS = await PQRS.findById(id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('productId', 'title');

    // Aplicar anonimato
    const pqrsObj = populatedPQRS.toObject();
    if (populatedPQRS.isAnonymous && !populatedPQRS.isCreator(userId)) {
      pqrsObj.fromUser = populatedPQRS.getAnonymizedFromUser(userId);
    }

    res.json({
      message: 'PQRS rechazada exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al rechazar PQRS:', error);
    res.status(500).json({ 
      message: 'Error al rechazar la PQRS',
      error: error.message 
    });
  }
};

// Responder PQRS como usuario destinatario
export const respondPQRSAsUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        message: 'El mensaje de respuesta es obligatorio'
      });
    }

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({
        message: 'PQRS no encontrada'
      });
    }

    if (pqrs.toUser.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Solo el usuario destinatario puede responder'
      });
    }

    if (pqrs.status === 'Cerrada' || pqrs.status === 'Rechazada') {
      return res.status(400).json({
        message: `No se puede responder a una PQRS en estado "${pqrs.status}"`
      });
    }

    pqrs.recipientResponse = {
      message: message.trim(),
      respondedAt: new Date(),
      accepted: pqrs.recipientResponse?.accepted || null
    };

    if (pqrs.status === 'Aceptada') {
      const oldStatus = pqrs.status;
      pqrs.status = 'En proceso';
      
      pqrs.addHistory(
        'Estado actualizado',
        req.user.id,
        'recipient',
        'PQRS pasa a En proceso tras respuesta del destinatario',
        oldStatus,
        'En proceso'
      );
    }
    
    pqrs.addHistory(
      'Respuesta del destinatario',
      req.user.id,
      'recipient',
      'Usuario destinatario agregó una respuesta'
    );

    await pqrs.save();

    const populatedPQRS = await PQRS.findById(id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');

    // Aplicar anonimato
    const pqrsObj = populatedPQRS.toObject();
    if (populatedPQRS.isAnonymous && !populatedPQRS.isCreator(req.user.id)) {
      pqrsObj.fromUser = populatedPQRS.getAnonymizedFromUser(req.user.id);
    }

    res.json({
      message: 'Respuesta enviada exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al responder PQRS:', error);
    res.status(500).json({
      message: 'Error al responder PQRS',
      error: error.message
    });
  }
};

// Responder PQRS (Admin)
export const respondPQRS = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, resolution } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        message: 'El mensaje de respuesta es obligatorio'
      });
    }

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({
        message: 'PQRS no encontrada'
      });
    }

    const oldStatus = pqrs.status;

    pqrs.adminResponse = {
      message: message.trim(),
      respondedBy: req.user.id,
      respondedAt: new Date(),
      resolution: resolution || pqrs.adminResponse?.resolution || ''
    };

    if (resolution && pqrs.canTransitionTo('Resuelta', 'admin')) {
      pqrs.status = 'Resuelta';
    } else if (pqrs.status === 'Pendiente' || pqrs.status === 'Aceptada') {
      pqrs.status = 'En proceso';
    }
    
    pqrs.addHistory(
      'Respuesta del administrador',
      req.user.id,
      'admin',
      `Respuesta proporcionada${resolution ? ' con resolución: ' + resolution : ''}`,
      oldStatus,
      pqrs.status
    );

    await pqrs.save();

    const populatedPQRS = await PQRS.findById(id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('adminResponse.respondedBy', 'name email');

    // Admin ve info anónima también
    const pqrsObj = populatedPQRS.toObject();
    if (populatedPQRS.isAnonymous) {
      pqrsObj.fromUser = populatedPQRS.getAnonymizedFromUser(req.user.id);
    }

    res.json({
      message: 'Respuesta enviada exitosamente',
      pqrs: pqrsObj
    });
  } catch (error) {
    console.error('Error al responder PQRS:', error);
    res.status(500).json({
      message: 'Error al responder PQRS',
      error: error.message
    });
  }
};

// Actualizar estado de PQRS (Admin)
export const updatePQRSStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({
        message: 'PQRS no encontrada'
      });
    }

    if (!pqrs.canTransitionTo(status, 'admin')) {
      return res.status(400).json({
        message: `No se puede cambiar de "${pqrs.status}" a "${status}"`
      });
    }

    const oldStatus = pqrs.status;
    pqrs.status = status;
    
    pqrs.addHistory(
      'Estado actualizado',
      req.user.id,
      'admin',
      `Estado cambiado de ${oldStatus} a ${status}${notes ? ': ' + notes : ''}`,
      oldStatus,
      status
    );

    await pqrs.save();

    res.json({
      message: 'Estado actualizado exitosamente',
      pqrs
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
};

// Calificar solución (Usuario creador)
export const ratePQRS = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        message: 'La calificación debe ser entre 1 y 5'
      });
    }

    const pqrs = await PQRS.findById(id);

    if (!pqrs) {
      return res.status(404).json({
        message: 'PQRS no encontrada'
      });
    }

    // Verificar que sea el creador (incluso si es anónima)
    if (!pqrs.isCreator(req.user.id)) {
      return res.status(403).json({
        message: 'No tienes permiso para calificar esta PQRS'
      });
    }

    if (!pqrs.canTransitionTo('Cerrada', 'user')) {
      return res.status(400).json({
        message: 'Solo puedes calificar PQRS resueltas'
      });
    }

    pqrs.rating = {
      score,
      comment: comment || '',
      ratedAt: new Date()
    };

    const oldStatus = pqrs.status;
    pqrs.status = 'Cerrada';
    
    pqrs.addHistory(
      'Calificada y cerrada',
      req.user.id,
      'creator',
      `Calificación: ${score}/5${comment ? ' - ' + comment.substring(0, 50) : ''}`,
      oldStatus,
      'Cerrada'
    );

    await pqrs.save();

    res.json({
      message: 'Calificación registrada exitosamente',
      pqrs
    });
  } catch (error) {
    console.error('Error al calificar PQRS:', error);
    res.status(500).json({
      message: 'Error al calificar PQRS',
      error: error.message
    });
  }
};

// Obtener todas las PQRS (Admin)
export const getAllPQRS = async (req, res) => {
  try {
    const { status, type, priority, category } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const pqrsList = await PQRS.find(query)
      .populate('fromUser', 'name email role')
      .populate('toUser', 'name email role')
      .populate('productId', 'title image')
      .populate('adminResponse.respondedBy', 'name email')
      .sort({ createdAt: -1 });

    // Admin también ve usuarios anónimos
    const filteredPQRS = pqrsList.map(pqrs => {
      const pqrsObj = pqrs.toObject();
      
      if (pqrs.isAnonymous) {
        pqrsObj.fromUser = pqrs.getAnonymizedFromUser(req.user.id);
      }
      
      return pqrsObj;
    });

    res.json({
      message: 'PQRS obtenidas exitosamente',
      pqrs: filteredPQRS,
      total: filteredPQRS.length
    });
  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    res.status(500).json({
      message: 'Error al obtener PQRS',
      error: error.message
    });
  }
};

// Obtener estadísticas (Admin)
export const getPQRSStats = async (req, res) => {
  try {
    const [
      totalPQRS,
      byStatus,
      byType,
      byPriority,
      avgRating,
      recentPQRS
    ] = await Promise.all([
      PQRS.countDocuments(),
      PQRS.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      PQRS.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      PQRS.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      PQRS.aggregate([
        { $match: { 'rating.score': { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$rating.score' } } }
      ]),
      PQRS.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('fromUser', 'name email')
        .populate('toUser', 'name email')
        .populate('productId', 'title')
    ]);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      stats: {
        total: totalPQRS,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byType: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        avgRating: avgRating[0]?.avg || 0,
        recentPQRS
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
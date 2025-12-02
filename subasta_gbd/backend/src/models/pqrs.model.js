import mongoose from 'mongoose';

const pqrsSchema = new mongoose.Schema({
  // Usuario que crea la PQRS (quien reporta)
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Usuario destinatario (contra quien se hace la PQRS)
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Tipo de PQRS
  type: {
    type: String,
    enum: ['Petición', 'Queja', 'Reclamo', 'Solicitud'],
    required: true
  },
  
  // Categoría (enfocada en transacciones)
  category: {
    type: String,
    enum: [
      'Pago no recibido',
      'Producto no entregado',
      'Producto defectuoso',
      'Descripción engañosa',
      'Comunicación deficiente',
      'Incumplimiento de términos',
      'Reembolso',
      'Sugerencia',
      'Otro'
    ],
    required: true
  },
  
  // Asunto
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Descripción detallada
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // Producto relacionado (OBLIGATORIO para contexto)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Transacción/Puja relacionada (opcional)
  bidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    default: null
  },
  
  // Prioridad
  priority: {
    type: String,
    enum: ['Baja', 'Media', 'Alta', 'Urgente'],
    default: 'Media'
  },
  
  // Estado mejorado con flujo más claro
  status: {
    type: String,
    enum: [
      'Pendiente',        // Recién creada, esperando respuesta del destinatario
      'Aceptada',         // Destinatario acepta la PQRS y se compromete a resolverla
      'Rechazada',        // Destinatario rechaza la PQRS (con justificación)
      'En proceso',       // Se está trabajando en la resolución (hay respuestas)
      'Resuelta',         // Admin marca como resuelta (esperando calificación)
      'Cerrada'           // Usuario califica y cierra el caso
    ],
    default: 'Pendiente'
  },
  
  // Anonimato COMPLETO - SIMPLIFICADO
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Número de ticket (generado automáticamente)
  ticketNumber: {
    type: String,
    unique: true
  },
  
  // Respuesta del usuario destinatario
  recipientResponse: {
    message: {
      type: String,
      default: ''
    },
    respondedAt: {
      type: Date,
      default: null
    },
    accepted: {
      type: Boolean,
      default: null
    }
  },
  
  // Fechas de aceptación/rechazo
  acceptedAt: {
    type: Date,
    default: null
  },
  
  rejectedAt: {
    type: Date,
    default: null
  },
  
  rejectionReason: {
    type: String,
    default: ''
  },
  
  // Respuesta/Mediación del administrador
  adminResponse: {
    message: {
      type: String,
      default: ''
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    respondedAt: {
      type: Date,
      default: null
    },
    resolution: {
      type: String,
      enum: ['', 'A favor del comprador', 'A favor del vendedor', 'Acuerdo mutuo', 'Sin resolución'],
      default: ''
    }
  },
  
  // Historial de cambios
  history: [{
    action: {
      type: String,
      required: true
    },
    // Para PQRS anónimas, guardamos el ID pero no lo exponemos
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedByRole: {
      type: String,
      enum: ['creator', 'recipient', 'admin'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  
  // Archivos adjuntos (URLs)
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Calificación de la solución
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    comment: {
      type: String,
      default: ''
    },
    ratedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Generar número de ticket antes de guardar
pqrsSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const count = await mongoose.model('PQRS').countDocuments();
    const sequential = String(count + 1).padStart(5, '0');
    
    this.ticketNumber = `PQRS-${year}${month}-${sequential}`;
  }
  next();
});

// Método para agregar entrada al historial
pqrsSchema.methods.addHistory = function(action, userId, userRole, details = '', oldValue = null, newValue = null) {
  this.history.push({
    action,
    performedBy: userId,
    performedByRole: userRole,
    details,
    oldValue,
    newValue
  });
};

// Método para obtener información del usuario con anonimato TOTAL aplicado
pqrsSchema.methods.getAnonymizedFromUser = function(requestingUserId) {
  // Si NO es anónimo, retornar usuario completo
  if (!this.isAnonymous) {
    return this.fromUser;
  }

  // Si ES anónimo, SIEMPRE retornar usuario anónimo
  // No importa quién pregunte (ni admin, ni destinatario)
  return {
    _id: null,
    name: 'Usuario Anónimo',
    email: 'anonimo@sistema.com',
    isAnonymous: true
  };
};

// Método para validar si el usuario es el creador (para PQRS anónimas)
pqrsSchema.methods.isCreator = function(userId) {
  return this.fromUser.toString() === userId;
};

// Método para validar transiciones de estado
pqrsSchema.methods.canTransitionTo = function(newStatus, userRole) {
  const current = this.status;
  
  const validTransitions = {
    'Pendiente': {
      user: ['Aceptada', 'Rechazada'],
      admin: ['En proceso', 'Resuelta']
    },
    'Aceptada': {
      user: ['En proceso'],
      admin: ['En proceso', 'Resuelta']
    },
    'Rechazada': {
      user: [],
      admin: ['En proceso', 'Resuelta']
    },
    'En proceso': {
      user: [],
      admin: ['Resuelta', 'Rechazada']
    },
    'Resuelta': {
      user: ['Cerrada'],
      admin: ['En proceso']
    },
    'Cerrada': {
      user: [],
      admin: []
    }
  };

  const allowedTransitions = validTransitions[current]?.[userRole] || [];
  return allowedTransitions.includes(newStatus);
};

// Asegurar que los virtuals se incluyan en JSON
pqrsSchema.set('toJSON', { virtuals: true });
pqrsSchema.set('toObject', { virtuals: true });

export default mongoose.model('PQRS', pqrsSchema);
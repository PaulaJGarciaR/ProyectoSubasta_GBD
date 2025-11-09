import mongoose from "mongoose";

const analyticsSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    ubicacion: {
      ip: String,
      navegador: String,
      sistemaOperativo: String,
      pais: String,
      departamento: String,
      ciudad: String,
    },

    tiempoSesion: {
      inicio: {
        type: Date,
        required: true,
        default: Date.now,
      },
      fin: {
        type: Date,
        default: null,
      },
      duracionSegundos: {
        type: Number,
        default: 0,
      },
      activa: {
        type: Boolean,
        default: true,
        index: true,
      },
    },

    fechaIngreso: {
      hora: Number,
      dia: Number,
      mes: Number,
      año: Number,
      diaSemana: String,
      timestamp: Date,
    },

    interacciones: {
      busquedas: [
        {
          termino: String,
          timestamp: Date,
          resultados: Number,
        },
      ],
      filtrosUsados: [
        {
          tipo: String,
          valor: String,
          timestamp: Date,
        },
      ],
      productosVistos: [
        {
          productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          timestamp: Date,
          tiempoVisualizacion: Number,
        },
      ],
    },

    categoriasClicadas: [
      {
        categoria: {
          type: String,
          required: true,
        },
        clicks: {
          type: Number,
          default: 1,
        },
        tiempoSegundos: {
          type: Number,
          default: 0,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    intentosPuja: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        montoIntentado: {
          type: Number,
          required: true,
        },
        exitoso: {
          type: Boolean,
          required: true,
        },
        razonFallo: {
          type: String,
          default: null,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    paginasVistas: [
      {
        ruta: String,
        titulo: String,
        timestamp: Date,
        tiempoEnPagina: Number,
      },
    ],
  },
  {
    timestamps: true,
    collection: "analytics_sessions",
  }
);

analyticsSessionSchema.methods.cerrar = function () {
  this.tiempoSesion.fin = new Date();
  this.tiempoSesion.activa = false;
  this.tiempoSesion.duracionSegundos = Math.floor(
    (this.tiempoSesion.fin - this.tiempoSesion.inicio) / 1000
  );
  return this.save();
};

export default mongoose.model("AnalyticsSession", analyticsSessionSchema);

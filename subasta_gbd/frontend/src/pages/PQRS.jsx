import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Plus,
  Search,
  Send,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Filter,
} from "lucide-react";
import {
  getUserPQRSRequest,
  respondPQRSAsUserRequest,
  ratePQRSRequest,
  acceptPQRSRequest,
  rejectPQRSRequest,
} from "../api/pqrs";
import { useAuth } from "../context/AuthContext";
import PQRSForm from "../components/PQRSForm";
import Swal from "sweetalert2";

// Constantes
const PQRS_STATUS = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  RESUELTA: "Resuelta",
  CERRADA: "Cerrada",
  RECHAZADA: "Rechazada",
  ACEPTADA: "Aceptada",
};

const PQRS_TYPES = {
  PETICION: "Petición",
  QUEJA: "Queja",
  RECLAMO: "Reclamo",
  SOLICITUD: "Solicitud",
};

const STATUS_CONFIG = {
  [PQRS_STATUS.PENDIENTE]: {
    className: "bg-yellow-500/20 text-yellow-400",
    iconClassName: "text-yellow-400",
    icon: Clock,
  },
  [PQRS_STATUS.EN_PROCESO]: {
    className: "bg-blue-500/20 text-blue-400",
    iconClassName: "text-blue-400",
    icon: MessageSquare,
  },
  [PQRS_STATUS.RESUELTA]: {
    className: "bg-green-500/20 text-green-400",
    iconClassName: "text-green-400",
    icon: CheckCircle,
  },
  [PQRS_STATUS.CERRADA]: {
    className: "bg-gray-500/20 text-gray-400",
    iconClassName: "text-gray-400",
    icon: CheckCircle,
  },
  [PQRS_STATUS.RECHAZADA]: {
    className: "bg-red-500/20 text-red-400",
    iconClassName: "text-red-400",
    icon: XCircle,
  },
  [PQRS_STATUS.ACEPTADA]: {
    className: "bg-green-500/20 text-green-400",
    iconClassName: "text-green-400",
    icon: ThumbsUp,
  },
};

const TYPE_CONFIG = {
  [PQRS_TYPES.PETICION]: {
    className: "bg-blue-500/20 text-blue-400",
    icon: FileText,
  },
  [PQRS_TYPES.QUEJA]: {
    className: "bg-red-500/20 text-red-400",
    icon: AlertCircle,
  },
  [PQRS_TYPES.RECLAMO]: {
    className: "bg-orange-500/20 text-orange-400",
    icon: AlertCircle,
  },
  [PQRS_TYPES.SOLICITUD]: {
    className: "bg-purple-500/20 text-purple-400",
    icon: FileText,
  },
};

const SWAL_CONFIG = {
  confirmButtonColor: "#fa7942",
  background: "#171d26",
  color: "#f7f9fb",
};

// Hook personalizado para PQRS
const usePQRS = () => {
  const [pqrsList, setPqrsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    direction: "",
    search: "",
  });

  const loadPQRS = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.direction) params.direction = filters.direction;

      const response = await getUserPQRSRequest(params);
      console.log("📥 PQRS obtenidas:", response.data);
      setPqrsList(response.data.pqrs || []);
    } catch (error) {
      console.error("Error al cargar PQRS:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las PQRS",
        icon: "error",
        ...SWAL_CONFIG,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPQRS();
  }, [loadPQRS]);

  return {
    pqrsList,
    loading,
    filters,
    setFilters,
    loadPQRS,
  };
};

// Componente de filtros
const PQRSFilters = ({ filters, onFilterChange, onSearchChange }) => {
  return (
    <div className=" rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-white font-semibold">Filtros</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ticket o asunto..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#171d26] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
        </div>

        <select
          value={filters.direction}
          onChange={(e) => onFilterChange("direction", e.target.value)}
          className="px-4 py-2 bg-[#171d26]  rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        >
          <option value="">Todas (enviadas y recibidas)</option>
          <option value="sent">Enviadas por mí</option>
          <option value="received">Recibidas</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="px-4 py-2 bg-[#171d26] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        >
          <option value="">Todos los estados</option>
          {Object.values(PQRS_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="px-4 py-2 bg-[#171d26] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        >
          <option value="">Todos los tipos</option>
          {Object.values(PQRS_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Componente de estado vacío
const EmptyState = ({ onCreateNew }) => (
  <div className="bg-[#171d26] rounded-xl p-12 text-center border border-gray-800">
    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-400 mb-2">
      No tienes PQRS registradas
    </h3>
    <p className="text-gray-500 mb-6">
      Crea tu primera petición, queja, reclamo o solicitud
    </p>
    <button
      onClick={onCreateNew}
      className="px-6 py-3 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold transition-colors"
    >
      Crear PQRS
    </button>
  </div>
);

// Componente de tarjeta PQRS
const PQRSCard = ({
  pqrs,
  user,
  onRespond,
  onRate,
  onAccept,
  onReject,
  onViewDetails,
}) => {
  const statusConfig =
    STATUS_CONFIG[pqrs.status] || STATUS_CONFIG[PQRS_STATUS.PENDIENTE];
  const typeConfig = TYPE_CONFIG[pqrs.type] || TYPE_CONFIG[PQRS_TYPES.PETICION];

  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const isSentByMe = pqrs.fromUser?._id === user?.id;
  const otherUser = isSentByMe ? pqrs.toUser : pqrs.fromUser;

  const canRespond =
    !isSentByMe &&
    pqrs.status !== PQRS_STATUS.CERRADA &&
    pqrs.status !== PQRS_STATUS.RECHAZADA &&
    pqrs.status !== PQRS_STATUS.ACEPTADA &&
    !pqrs.recipientResponse?.message;

  // El destinatario puede aceptar/rechazar si la PQRS está Pendiente
  const canAcceptReject =
    !isSentByMe &&
    (pqrs.status === PQRS_STATUS.PENDIENTE ||
      pqrs.status === PQRS_STATUS.EN_PROCESO);

  const canRate =
    isSentByMe && pqrs.status === PQRS_STATUS.RESUELTA && !pqrs.rating?.score;

  console.log("🔍 Debug PQRS:", {
    ticketNumber: pqrs.ticketNumber,
    status: pqrs.status,
    isSentByMe,
    canAcceptReject,
    fromUserId: pqrs.fromUser?._id,
    toUserId: pqrs.toUser?._id,
    currentUserId: user?.id,
  });

  return (
    <div className="bg-[#171d26] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-[#13171f] rounded-lg">
              <TypeIcon className="w-5 h-5 text-[#fa7942]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm text-gray-400 font-mono">
                  {pqrs.ticketNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${typeConfig.className}`}
                >
                  {pqrs.type}
                </span>
                {isSentByMe ? (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-400 flex items-center gap-1">
                    Enviada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 flex items-center gap-1">
                    Recibida
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {pqrs.subject}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                {pqrs.description}
              </p>
              <p className="text-sm text-gray-500">
                {isSentByMe ? "Destinatario" : "Remitente"}: {otherUser?.email}
              </p>
              {pqrs.productId && (
                <p className="text-sm text-gray-500">
                  Producto: {pqrs.productId.title}
                </p>
              )}
            </div>
          </div>

          {pqrs.recipientResponse?.message && (
            <div className="flex justify-center ">
              <div className="w-full mt-4 p-4 bg-[#13171f] rounded-lg border-l-4 border-[#fa7942]  ">
                <p className="text-sm text-gray-400 mb-1">
                  Respuesta del {isSentByMe ? "destinatario" : "remitente"}:
                </p>
                <p className="text-white">{pqrs.recipientResponse.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(pqrs.recipientResponse.respondedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {pqrs.adminResponse?.message && (
            <div className="mt-4 p-4 bg-[#13171f] rounded-lg border-l-4 border-[#fa7942]">
              <p className="text-sm text-gray-400 mb-1">
                Respuesta del administrador:
              </p>
              <p className="text-white">{pqrs.adminResponse.message}</p>
              {pqrs.adminResponse.resolution && (
                <p className="text-sm text-[#fa7942] mt-2 font-semibold">
                  Resolución: {pqrs.adminResponse.resolution}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(pqrs.adminResponse.respondedAt).toLocaleString()}
              </p>
            </div>
          )}

          {pqrs.rejectionReason && (
            <div className="mt-4 p-4 bg-[#6892e7] rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-400 mb-1">Motivo de rechazo:</p>
              <p className="text-white">{pqrs.rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end mt-[5%] gap-3 ">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.className}`}
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig.iconClassName}`} />
            <span
              className={`text-sm font-medium ${statusConfig.iconClassName}`}
            >
              {pqrs.status}
            </span>
          </div>

          <div className="text-right text-sm text-gray-400">
            <p>{new Date(pqrs.createdAt).toLocaleDateString()}</p>
            <p className="text-xs">{pqrs.category}</p>
          </div>

          <div className="flex flex-col gap-2 w-full lg:min-w-[200px]">
            {canAcceptReject && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(pqrs)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  title="Aceptar PQRS"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Aceptar
                </button>
                <button
                  onClick={() => onReject(pqrs)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  title="Rechazar PQRS"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Rechazar
                </button>
              </div>
            )}

            {canRespond && (
              <button
                onClick={() => onRespond(pqrs)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Responder
              </button>
            )}

            {canRate && (
              <button
                onClick={() => onRate(pqrs._id)}
                className="w-full px-4 py-2 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Calificar
              </button>
            )}

            <button
              onClick={() => onViewDetails(pqrs)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Ver detalles
            </button>
          </div>

          {pqrs.rating?.score && (
            <div className="flex items-center gap-1">
              {[...Array(pqrs.rating.score)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function PQRS() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedPQRS, setSelectedPQRS] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { pqrsList, loading, filters, setFilters, loadPQRS } = usePQRS();

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setFilters((prev) => ({ ...prev, search: value }));
    },
    [setFilters]
  );

  const filteredPQRS = useMemo(() => {
    return pqrsList.filter((pqrs) => {
      const matchesSearch =
        pqrs.subject?.toLowerCase().includes(filters.search.toLowerCase()) ||
        pqrs.ticketNumber?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });
  }, [pqrsList, filters.search]);

  const handleRespond = async (pqrs) => {
    const { value: message } = await Swal.fire({
      title: "Responder PQRS",
      html: `
        <p class="text-gray-400 mb-4">Ticket: ${pqrs.ticketNumber}</p>
        <textarea
          id="response-message"
          class="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942] min-h-[120px]"
          placeholder="Escribe tu respuesta..."
        ></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      ...SWAL_CONFIG,
      preConfirm: () => {
        const textarea = document.getElementById("response-message");
        if (!textarea.value || textarea.value.trim() === "") {
          Swal.showValidationMessage("Por favor escribe una respuesta");
          return false;
        }
        return textarea.value;
      },
    });

    if (message) {
      try {
        await respondPQRSAsUserRequest(pqrs._id, message);

        await Swal.fire({
          title: "¡Respuesta enviada!",
          text: "Tu respuesta ha sido registrada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          ...SWAL_CONFIG,
        });

        loadPQRS();
      } catch (error) {
        console.error("Error al responder:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message || "No se pudo enviar la respuesta",
          icon: "error",
          ...SWAL_CONFIG,
        });
      }
    }
  };

  const handleRate = async (pqrsId) => {
    const { value: formValues } = await Swal.fire({
      title: "Calificar solución",
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Calificación (1-5 estrellas)
            </label>
            <div class="flex justify-center gap-2">
              ${[1, 2, 3, 4, 5]
                .map(
                  (num) => `
                <button 
                  type="button"
                  class="star-btn text-4xl text-gray-600 hover:text-yellow-400 transition-colors"
                  data-rating="${num}"
                >
                  ⭐
                </button>
              `
                )
                .join("")}
            </div>
            <input type="hidden" id="rating-value" value="0">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              id="rating-comment"
              class="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942] min-h-[100px]"
              placeholder="Cuéntanos tu experiencia..."
            ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Enviar calificación",
      cancelButtonText: "Cancelar",
      ...SWAL_CONFIG,
      didOpen: () => {
        const stars = document.querySelectorAll(".star-btn");
        const ratingInput = document.getElementById("rating-value");

        stars.forEach((star) => {
          star.addEventListener("click", (e) => {
            const rating = e.target.dataset.rating;
            ratingInput.value = rating;

            stars.forEach((s, idx) => {
              if (idx < rating) {
                s.style.color = "#fbbf24";
              } else {
                s.style.color = "#4b5563";
              }
            });
          });
        });
      },
      preConfirm: () => {
        const score = parseInt(document.getElementById("rating-value").value);
        const comment = document.getElementById("rating-comment").value;

        if (score === 0) {
          Swal.showValidationMessage("Por favor selecciona una calificación");
          return false;
        }

        return { score, comment };
      },
    });

    if (formValues) {
      try {
        await ratePQRSRequest(pqrsId, formValues);

        await Swal.fire({
          title: "¡Gracias por tu calificación!",
          text: "Tu opinión nos ayuda a mejorar",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          ...SWAL_CONFIG,
        });

        loadPQRS();
      } catch (error) {
        console.error("Error al calificar:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "No se pudo registrar la calificación",
          icon: "error",
          ...SWAL_CONFIG,
        });
      }
    }
  };

  const handleAccept = async (pqrs) => {
    const result = await Swal.fire({
      title: "¿Aceptar PQRS?",
      html: `
        <p class="text-gray-400 mb-2">Ticket: <strong>${pqrs.ticketNumber}</strong></p>
        <p class="text-gray-400">¿Estás seguro de aceptar esta ${pqrs.type}?</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
      ...SWAL_CONFIG,
    });

    if (result.isConfirmed) {
      try {
        await acceptPQRSRequest(pqrs._id);

        await Swal.fire({
          title: "¡PQRS Aceptada!",
          text: "La PQRS ha sido aceptada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          ...SWAL_CONFIG,
        });

        loadPQRS();
      } catch (error) {
        console.error("Error al aceptar:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "No se pudo aceptar la PQRS",
          icon: "error",
          ...SWAL_CONFIG,
        });
      }
    }
  };

  const handleReject = async (pqrs) => {
    const { value: reason } = await Swal.fire({
      title: "Rechazar PQRS",
      html: `
        <p class="text-gray-400 mb-4">Ticket: ${pqrs.ticketNumber}</p>
        <textarea
          id="rejection-reason"
          class="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942] min-h-[120px]"
          placeholder="Explica el motivo del rechazo..."
        ></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
      ...SWAL_CONFIG,
      preConfirm: () => {
        const textarea = document.getElementById("rejection-reason");
        if (!textarea.value || textarea.value.trim() === "") {
          Swal.showValidationMessage("Por favor explica el motivo del rechazo");
          return false;
        }
        return textarea.value;
      },
    });

    if (reason) {
      try {
        await rejectPQRSRequest(pqrs._id, reason);

        await Swal.fire({
          title: "PQRS Rechazada",
          text: "La PQRS ha sido rechazada",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
          ...SWAL_CONFIG,
        });

        loadPQRS();
      } catch (error) {
        console.error("Error al rechazar:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "No se pudo rechazar la PQRS",
          icon: "error",
          ...SWAL_CONFIG,
        });
      }
    }
  };

  const handleViewDetails = (pqrs) => {
    setSelectedPQRS(pqrs);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-[#fa7942] animate-spin mb-4" />
        <p className="text-gray-400">Cargando PQRS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13171f] p-6 mt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">PQRS</h1>
            <p className="text-gray-400 mt-1">
              Gestiona tus peticiones, quejas, reclamos y solicitudes
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva PQRS
          </button>
        </div>

        {/* Filtros */}
        <PQRSFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Lista de PQRS */}
        {filteredPQRS.length === 0 ? (
          <EmptyState onCreateNew={() => setShowForm(true)} />
        ) : (
          <div className="grid gap-4">
            {filteredPQRS.map((pqrs) => (
              <PQRSCard
                key={pqrs._id}
                pqrs={pqrs}
                user={user}
                onRespond={handleRespond}
                onRate={handleRate}
                onAccept={handleAccept}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedPQRS && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171d26] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Detalles de PQRS
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                  {selectedPQRS.ticketNumber}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tipo</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                      TYPE_CONFIG[selectedPQRS.type]?.className
                    }`}
                  >
                    {selectedPQRS.type}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estado</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                      STATUS_CONFIG[selectedPQRS.status]?.className
                    }`}
                  >
                    {selectedPQRS.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Categoría</p>
                <p className="text-white">{selectedPQRS.category}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Asunto</p>
                <p className="text-white font-semibold">
                  {selectedPQRS.subject}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">
                  Descripción completa
                </p>
                <p className="text-white whitespace-pre-wrap">
                  {selectedPQRS.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">De</p>
                  <p className="text-gray-500 text-xs">
                    {selectedPQRS.fromUser?.email || "Usuario Anónimo"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Para</p>
                  <p className="text-gray-500 text-xs">
                    {selectedPQRS.toUser?.email || "Usuario Anónimo"}
                  </p>
                </div>
              </div>

              {selectedPQRS.productId && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Producto relacionado
                  </p>
                  <p className="text-white">{selectedPQRS.productId.title}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de creación</p>
                <p className="text-white">
                  {new Date(selectedPQRS.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedPQRS.recipientResponse?.message && (
                <div className="p-4 bg-[#13171f] rounded-lg border-l-4 border-[#fa7942]">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">
                    Respuesta del usuario:
                  </p>
                  <p className="text-white mb-2">
                    {selectedPQRS.recipientResponse.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(
                      selectedPQRS.recipientResponse.respondedAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedPQRS.adminResponse?.message && (
                <div className="p-4 bg-[#13171f] rounded-lg border-l-4 border-[#fa7942]">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">
                    Respuesta del administrador:
                  </p>
                  <p className="text-white mb-2">
                    {selectedPQRS.adminResponse.message}
                  </p>
                  {selectedPQRS.adminResponse.resolution && (
                    <p className="text-sm text-[#fa7942] mb-2 font-semibold">
                      Resolución: {selectedPQRS.adminResponse.resolution}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(
                      selectedPQRS.adminResponse.respondedAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedPQRS.rejectionReason && (
                <div className="p-4 bg-[#13171f] rounded-lg border-l-4 border-red-500">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">
                    Motivo de rechazo:
                  </p>
                  <p className="text-white">{selectedPQRS.rejectionReason}</p>
                </div>
              )}

              {selectedPQRS.rating?.score && (
                <div className="p-4 bg-[#13171f] rounded-lg">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">
                    Calificación:
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(selectedPQRS.rating.score)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-white ml-2">
                      ({selectedPQRS.rating.score}/5)
                    </span>
                  </div>
                  {selectedPQRS.rating.comment && (
                    <p className="text-white text-sm">
                      {selectedPQRS.rating.comment}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171d26] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <PQRSForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                loadPQRS();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

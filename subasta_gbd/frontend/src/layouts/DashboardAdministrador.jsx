import React, { useState, useEffect } from "react";
import {
  Users,
  Download,
  Activity,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  Eye,
  Search,
  Filter,
  Gavel,
  X,
  Menu,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const API_URL = "http://localhost:4000/api";

const DashboardAdministrador = () => {
  const [sesiones, setSesiones] = useState([]);
  const [statsGenerales, setStatsGenerales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { logout, user } = useAuth();
  const [filtros, setFiltros] = useState({
    limite: 50,
    busqueda: "",
  });
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir de tu cuenta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#fa7942",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#171d26",
      color: "#f7f9fb",
      customClass: {
        popup: "border border-slate-700",
      },
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "¡Hasta pronto!",
        text: "Has cerrado sesión exitosamente",
        icon: "success",
        confirmButtonColor: "#fa7942",
        background: "#171d26",
        color: "#f7f9fb",
        timer: 1500,
        showConfirmButton: false,
      });

      logout();
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filtros.limite]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Estadísticas generales
      const statsRes = await fetch(`${API_URL}/analytics/admin/general`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatsGenerales(statsData.data);
      }

      // Todas las sesiones
      const sesionesRes = await fetch(
        `${API_URL}/analytics/admin/sessions?limit=${filtros.limite}&page=${page}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!sesionesRes.ok) throw new Error("Error cargando sesiones");

      const sesionesData = await sesionesRes.json();
      setSesiones(sesionesData.data || []);
      setTotalPages(sesionesData.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error cargando datos. Verifica permisos de administrador.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportarCSV = async () => {
    try {
      const response = await fetch(
        `${API_URL}/analytics/admin/export?formato=csv`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error exportando");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Error al exportar datos");
    }
  };

  if (loading && sesiones.length === 0) {
    return (
      <div className="min-h-screen bg-[#13171f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13171f] p-6">
      <div className="max-w-[1800px] mx-auto flex-1 overflow-y-auto pt-[75px]">
        <header className="fixed top-0 left-0 right-0 bg-[#171d26] border-b border-slate-700 p-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fa7942] rounded-lg flex items-center justify-center">
                  <button
                    className="cursor-pointer"
                    onClick={() => handlePageChange("inicio")}
                  >
                    <Gavel className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#fa7942]">
                    SubastasNaPa
                  </h1>
                  <p className="text-xs text-slate-400">
                    Tu casa de subastas digital
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-[#ff9365] rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#fa7942] transition-all cursor-pointer text-white">
                <User className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">
                    Administrador
                  </p>
                  <p className="text-xs text-slate-400">
                    {user?.email || "email@ejemplo.com"}
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2 bg-[#fa7942] text-white font-semibold rounded-lg hover:bg-[#ff9365]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">
                Historial Usuarios
              </h1>
            </div>
            <p className="text-gray-400">
              Registro completo de sesiones y categorías visitadas
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="bg-[#fa7942] font-semibold cursor-pointer hover:bg-[#ff9365] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {statsGenerales && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#171d26]  rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 text-sm font-semibold ">Sesiones</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {statsGenerales.totalSesiones || 0}
              </p>
            </div>
            <div className="bg-[#171d26] rounded-lg p-4 ">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 text-sm font-semibold">Usuarios</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {statsGenerales.usuariosUnicos || 0}
              </p>
            </div>
            <div className="bg-[#171d26] rounded-lg p-4 ">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 text-sm font-semibold">Promedio</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {statsGenerales.tiempoPromedioMinutos || 0} min
              </p>
            </div>
            <div className="bg-[#171d26] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 font-semibold text-sm">Pujas</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {statsGenerales.totalPujas || 0}
              </p>
            </div>
            <div className="bg-[#171d26] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 font-semibold text-sm">
                  Categorías
                </p>
              </div>
              <p className="text-2xl font-bold text-white">
                {statsGenerales.totalCategorias || 0}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Controles */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <select
              value={filtros.limite}
              onChange={(e) => {
                setFiltros({ ...filtros, limite: parseInt(e.target.value) });
                setPage(1);
              }}
              className="bg-[#171d26] text-white px-4 py-2 rounded-lg"
            >
              <option value="20">20 registros</option>
              <option value="50">50 registros</option>
              <option value="100">100 registros</option>
            </select>
            <p className="text-gray-400">Total: {sesiones.length} sesiones</p>
          </div>

          {/* Paginación */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-[#334155] hover:bg-[#171d26] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white px-4">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-[#334155] hover:bg-[#171d26] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#171d26] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fa7942]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#13171f]">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#13171f]">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#13171f]">
                    Duración
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#13171f]">
                    Categorías Visitadas
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#13171f]">
                    Pujas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#13171f]">
                    Sistema
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#13171f]">
                    Ubicación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sesiones.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No hay sesiones registradas
                    </td>
                  </tr>
                ) : (
                  sesiones.map((sesion) => {
                    const pujasExitosas =
                      sesion.intentosPuja?.filter((p) => p.exitoso).length || 0;
                    const totalPujas = sesion.intentosPuja?.length || 0;

                    return (
                      <tr
                        key={sesion._id}
                        className="hover:bg-white/5 transition"
                      >
                        {/* Usuario */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">
                              {sesion.userId?.email || "Usuario desconocido"}
                            </p>
                            <p className="text-gray-400 text-xs font-mono">
                              {sesion.userId?._id?.toString().slice(0, 12)}...
                            </p>
                          </div>
                        </td>

                        {/* Fecha/Hora */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white text-sm">
                              {formatDate(sesion.tiempoSesion.inicio)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {sesion.fechaIngreso?.diaSemana}
                            </p>
                          </div>
                        </td>

                        {/* Duración */}
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">
                            {formatDuration(
                              sesion.tiempoSesion.duracionSegundos
                            )}
                          </p>
                        </td>

                        {/* Categorías */}
                        <td className="px-6 py-4 ">
                          {sesion.categoriasClicadas &&
                          sesion.categoriasClicadas.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {sesion.categoriasClicadas.map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="w-[60%] inline-flex items-center gap-1 px-2 py-1 bg-[#fa7942]/20 text-[#fa7942] text-xs rounded border border-[#fa7942]/30"
                                >
                                  <span className="capitalize font-medium">
                                    {cat.categoria}
                                  </span>
                                  <span className="text-[#fa7942]">
                                    ({cat.clicks})
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Sin categorías
                            </span>
                          )}
                        </td>

                        {/* Pujas */}
                        <td className="px-6 py-4">
                          {totalPujas > 0 ? (
                            <div>
                              <p className="text-white font-medium">
                                {totalPujas}
                              </p>
                              <p className="text-xs">
                                <span className="text-green-400">
                                  {pujasExitosas} 
                                </span>
                                <span className="text-[#334155]">{" / "}</span>
                                
                                <span className="text-red-400">
                                  {totalPujas - pujasExitosas} 
                                </span>
                              </p>
                              {sesion.intentosPuja &&
                                sesion.intentosPuja.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {sesion.intentosPuja.map((puja, idx) => (
                                      <div key={idx} className="text-xs">
                                        <span
                                          className={
                                            puja.exitoso
                                              ? "text-green-400"
                                              : "text-red-400"
                                          }
                                        >
                                          {formatMoney(puja.montoIntentado)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>

                        {/* Sistema */}
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-white">
                              {sesion.ubicacion?.sistemaOperativo || "N/A"}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {sesion.ubicacion?.navegador?.split(" ")[0] ||
                                "N/A"}
                            </p>
                          </div>
                        </td>

                        {/* Ubicación */}
                        <td className="px-6 py-4">
                          <div className="text-xs">
                            <p className="text-white">
                              {sesion.ubicacion?.ciudad || "N/A"}
                            </p>
                            <p className="text-white text-xs">
                              {sesion.ubicacion?.departamento || "N/A"}
                            </p>
                            <p className="text-white text-xs">
                              {sesion.ubicacion?.pais || "N/A"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p className="mt-1">
            Última actualización: {new Date().toLocaleTimeString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdministrador;

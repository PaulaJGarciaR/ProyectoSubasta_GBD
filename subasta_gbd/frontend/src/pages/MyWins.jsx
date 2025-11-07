import { useState, useEffect } from 'react';
import { getMyWinsRequest, getWinStatsRequest } from '../api/wins';
import { Trophy, DollarSign, TrendingUp, Package, Calendar, Eye, Loader2, Award, Target, Percent } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MyWinsPage() {
  const [wins, setWins] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWin, setSelectedWin] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [winsResponse, statsResponse] = await Promise.all([
        getMyWinsRequest(),
        getWinStatsRequest()
      ]);
      
      setWins(winsResponse.data.wins || []);
      setStats(statsResponse.data.stats || null);
    } catch (error) {
      console.error('Error al cargar victorias:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar tus victorias',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-[#fa7942] animate-spin mb-4" />
        <p className="text-gray-400">Cargando tus victorias...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13171f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-[#fa7942]" />
            <h1 className="text-3xl font-bold text-white">Mis Subastas Ganadas</h1>
          </div>
          <p className="text-gray-400">Historial de todas tus victorias</p>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Victorias */}
            <div className="bg-[#171d26] rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#ff9365]/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-[#ff9365]" />
                </div>
                <span className="text-3xl font-bold text-white">{stats.totalWins}</span>
              </div>
              <p className="text-sm text-gray-400">Total Victorias</p>
            </div>

            {/* Total Gastado */}
            <div className="bg-[#171d26] rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#ff9365]/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-[#ff9365]" />
                </div>
                <span className="text-xl font-bold text-white">
                  ${(stats.totalSpent || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-400">Total Invertido</p>
            </div>

            {/* Precio Promedio */}
            <div className="bg-[#171d26] rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#ff9365]/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#ff9365]" />
                </div>
                <span className="text-xl font-bold text-white">
                  ${(stats.avgPrice || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-400">Precio Promedio</p>
            </div>

            {/* Tasa de Éxito */}
            <div className="bg-[#171d26] rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#ff9365]/10 rounded-lg">
                  <Target className="w-6 h-6 text-[#ff9365]" />
                </div>
                <span className="text-3xl font-bold text-white">{stats.successRate}</span>
              </div>
              <p className="text-sm text-gray-400">Tasa de Éxito</p>
            </div>
          </div>
        )}

        {/* Lista de Victorias */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Todas mis Victorias</h2>
          
          {wins.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aún no has ganado ninguna subasta</p>
              <p className="text-gray-500 text-sm mt-2">¡Sigue pujando!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wins.map((win) => (
                <div
                  key={win._id}
                  className="bg-[#171d26] rounded-xl overflow-hidden border border-slate-700 hover:border-[#fa7942]/50 transition-all group"
                >
                  {/* Imagen */}
                  <div className="relative h-48">
                    <img
                      src={win.image}
                      alt={win.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#ff9365]">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        GANADA
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 space-y-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {win.title}
                    </h3>

                    <div className="space-y-2">
                      {/* Precio Final */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Precio pagado</span>
                        <span className="text-xl font-bold text-[#ff9365]">
                          ${(win.finalPrice || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Fecha de Victoria */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ganada el</span>
                        <span className="text-gray-300">{formatDate(win.wonDate)}</span>
                      </div>

                      {/* Mis pujas totales */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Mis pujas</span>
                        <span className="text-white font-semibold">{win.myTotalBids}</span>
                      </div>

                      {/* Vendedor */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Vendedor</span>
                        <span className="text-gray-300">{win.user?.email || 'Desconocido'}</span>
                      </div>
                    </div>

                    {/* Botón Ver Detalles */}
                    <button
                      onClick={() => setSelectedWin(win)}
                      className="w-full py-2.5 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles (simplificado - puedes expandirlo) */}
      {selectedWin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#171d26] rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Detalles de la Victoria</h3>
              <button
                onClick={() => setSelectedWin(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <img
                src={selectedWin.image}
                alt={selectedWin.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h4 className="text-2xl font-bold text-white">{selectedWin.title}</h4>
              <p className="text-gray-400">{selectedWin.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-sm text-gray-400">Precio Final</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(selectedWin.finalPrice || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Mis Pujas</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedWin.myTotalBids}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedWin(null)}
                className="w-full py-3 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
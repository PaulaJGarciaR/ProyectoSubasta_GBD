import { useState, useEffect } from "react";
import {
  Menu,
  Gavel,
  User,
  Bell,
  Search,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  Loader2,
  DollarSign,
  Tag,
  AlertCircle,
} from "lucide-react";
import UserProfile from "../pages/UserProfile";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useSocket } from "../context/SocketContext";
import { createBidRequest } from "../api/bids";
import NotificationsPanel from "../components/NotificationsPanel";
import Swal from 'sweetalert2';

var moneda = "COP";

function DashboardComprador() {
  const { logout, user } = useAuth();
  const { unreadCount } = useSocket();
  const [currentPage, setCurrentPage] = useState("inicio");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 150);
  };

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

  const renderContent = () => {
    switch (currentPage) {
      case "inicio":
        return <InicioContent />;
      case "perfil":
        return <UserProfile />;
      default:
        return <InicioContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#13171f] text-white">
      <main className="flex-1 overflow-y-auto pt-[75px]">
        {/* Header */}
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
              <button className="lg:hidden">
                <X className="w-6 h-6" />
              </button>
            </div>
            <button className="lg:hidden p-2 hover:bg-slate-700 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar subastas..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Botón de Notificaciones */}
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[#fa7942] rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange("perfil")}
                  className="w-10 h-10 bg-[#ff9365] rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#fa7942] transition-all cursor-pointer"
                  title="Ir a mi perfil"
                >
                  <User className="w-6 h-6" />
                </button>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Usuario</p>
                  <p className="text-xs text-slate-400">
                    {user?.email || "email@ejemplo.com"}
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2 bg-[#fa7942] rounded-lg hover:bg-[#ff9365]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dynamic Content */}
        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-150 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {renderContent()}
        </div>
      </main>

      {/* Panel de Notificaciones */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}

// Componente de Inicio
function InicioContent() {
  const [currentSlide] = useState(0);
  const { products, getProducts } = useProducts();
  const { socket } = useSocket();
  const [imageIndex, setImageIndex] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const heroImages = [
    "https://wallpapers.com/images/hd/sunset-black-ford-mustang-gt-s7wq5lfz762uptye.jpg",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  ];

  const productsList = [
    {
      id: 1,
      name: "Ford Mustang GT",
      year: 2020,
      description: "Muscle car americano con motor V8",
      features: ["Motor V8 5.0L", "450 HP"],
    },
  ];

  const featuredProduct = productsList[currentSlide];

  // Cargar productos
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        if (!isMounted) return;
        setLocalLoading(true);
        await getProducts();
      } catch (error) {
        if (!isMounted) return;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los productos',
          icon: 'error',
          confirmButtonColor: '#fa7942',
          background: '#171d26',
          color: '#f7f9fb',
        });
      } finally {
        if (isMounted) {
          setLocalLoading(false);
        }
      }
    };

    loadProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Escuchar actualizaciones de productos en tiempo real
  useEffect(() => {
    if (!socket) return;

    socket.on('product_updated', (data) => {
      console.log('Producto actualizado en tiempo real:', data);
      // Actualizar el producto específico
      getProducts();
    });

    return () => {
      socket.off('product_updated');
    };
  }, [socket]);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const getProductName = (product) => {
    return product.title || product.nombre || product.name || "Sin título";
  };

  const getProductDescription = (product) => {
    return product.description || product.descripcion || "Sin descripción";
  };

  const getProductImage = (product) => {
    return product.image || product.imagen || product.imageUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
  };

  const getProductPrice = (product) => {
    return product.currentPrice || product.startingPrice || product.precioInicial || 0;
  };

  const getProductEndDate = (product) => {
    if (product.dateEnd) {
      return new Date(product.dateEnd).toLocaleDateString('es-ES');
    }
    return product.fechaFin || product.endDate || "Por definir";
  };

  const getProductFeatures = (product) => {
    return product.features || product.caracteristicas || [];
  };

  const calculateTimeLeft = (product) => {
    let endDate;
    
    if (product.dateEnd) {
      endDate = new Date(product.dateEnd);
    } else {
      return "Por definir";
    }

    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return "Finalizada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setBidAmount('');
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setBidAmount('');
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa un monto válido',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
      });
      return;
    }

    const currentPrice = getProductPrice(selectedProduct);
    const bidValue = parseFloat(bidAmount);

    if (bidValue <= currentPrice) {
      Swal.fire({
        title: 'Puja muy baja',
        text: `Tu puja debe ser mayor al precio actual de $${currentPrice.toLocaleString()}`,
        icon: 'warning',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
      });
      return;
    }

    try {
      const response = await createBidRequest(selectedProduct._id, bidValue);
      
      await Swal.fire({
        title: '¡Puja registrada!',
        html: `
          <p>Has pujado <strong>$${bidValue.toLocaleString()}</strong></p>
          <p>por <strong>${getProductName(selectedProduct)}</strong></p>
        `,
        icon: 'success',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
        timer: 2000,
        showConfirmButton: false,
      });
      
      handleCloseModal();
      await getProducts();
      
    } catch (error) {
      console.error('Error al crear puja:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar la puja',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1F29]">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImages[imageIndex]}
            alt="Hero"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1 bg-orange-500/20 border border-orange-500 rounded-full text-orange-400 text-sm mb-4">
              Subasta Destacada
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {featuredProduct.name}{" "}
              <span className="text-[#FF6F3C]">{featuredProduct.year}</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              {featuredProduct.description}
            </p>

            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all inline-flex items-center gap-2">
              Características Principales
              <ChevronRight size={20} />
            </button>

            <div className="mt-8 space-y-2 text-gray-300">
              <p className="text-sm">
                {featuredProduct.mechanicalAssistance ||
                  "Inspección disponible"}
              </p>
              <p className="text-sm">
                {featuredProduct.baseLocation || featuredProduct.location}
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Imagen {imageIndex + 1} de {heroImages.length}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === imageIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-16 bg-[#13171f] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Subastas Disponibles{" "}
              <span className="text-[#FF6F3C]">
                ({products.length})
              </span>
            </h3>
          </div>

          {localLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-[#fa7942] animate-spin mb-4" />
              <p className="text-gray-400">Cargando productos...</p>
            </div>
          )}

          {!localLoading && products.length === 0 && (
            <div className="text-center py-20">
              <Gavel className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay productos disponibles
              </p>
            </div>
          )}

          {!localLoading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-[#1a2332] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-800/30 hover:border-[#ff9365]/30 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={getProductName(product)}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                    
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#fa7942] backdrop-blur-sm">
                      <span className="text-white text-xs font-semibold">
                        {product.estado || "Activa"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white group-hover:text-[#fa7942] transition-colors line-clamp-1">
                      {getProductName(product)}
                    </h4>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {getProductDescription(product)}
                    </p>

                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1.5">
                        <TrendingUp size={14} className="text-[#fa7942]" />
                        <span>Precio actual</span>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                          ${getProductPrice(product).toLocaleString()}
                        </span>
                        <span className="text-lg font-medium text-gray-400">
                          {product.moneda || "COP"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-gray-800/50">
                      <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <div className="p-1 bg-orange-500/10 rounded">
                          <Clock size={16} className="text-[#fa7942]" />
                        </div>
                        <span>{calculateTimeLeft(product)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <div className="p-1 bg-blue-500/10 rounded">
                          <Calendar size={16} className="text-[#fa7942]" />
                        </div>
                        <span>{getProductEndDate(product)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="w-full py-3 bg-gradient-to-r from-[#fa7942] to-[#fa7942] hover:from-[#fa7942] hover:to-[#ff9365] cursor-pointer rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Eye size={18} />
                      Ver Subasta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalles del Producto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 h-screen flex items-center justify-center p-4 overflow-y-auto z-[60]">
          <div className="bg-[#13171f] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800/50 shadow-2xl">
            {/* Header del Modal */}
            <div className="relative">
              <img
                src={getProductImage(selectedProduct)}
                alt={getProductName(selectedProduct)}
                className="w-full h-96 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Sin+Imagen';
                }}
              />
              <div className="absolute inset-0 rounded-t-2xl" />
              
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="absolute bottom-4 left-6">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-[#fa7942] backdrop-blur-sm mb-2">
                  <span className="text-white text-sm font-semibold">
                    {selectedProduct.estado || selectedProduct.status || "Activa"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 space-y-6">
              {/* Título y Descripción */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {getProductName(selectedProduct)}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {getProductDescription(selectedProduct)}
                </p>
              </div>

              {/* Grid de Información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Precio Actual */}
                <div className="bg-[#171d26] p-6 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <TrendingUp size={20} className="text-[#fa7942]" />
                    <span className="text-sm font-medium">Precio Actual</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      ${getProductPrice(selectedProduct).toLocaleString()}
                    </span>
                    <span className="text-xl font-medium text-gray-400">
                      {selectedProduct.moneda || "COP"}
                    </span>
                  </div>
                  {selectedProduct.totalBids > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedProduct.totalBids} puja{selectedProduct.totalBids !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Tiempo Restante */}
                <div className="bg-[#171d26] p-6 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <Clock size={20} className="text-orange-500" />
                    <span className="text-sm font-medium">Tiempo Restante</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {calculateTimeLeft(selectedProduct)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                    <Calendar size={16} />
                    <span>Finaliza: {getProductEndDate(selectedProduct)}</span>
                  </div>
                </div>
              </div>

              {/* Características */}
              {getProductFeatures(selectedProduct).length > 0 && (
                <div className="bg-[#13171f] p-6 rounded-xl border border-gray-800/50">
                  <div className="flex items-center gap-2 text-white mb-4">
                    <Tag size={20} className="text-blue-500" />
                    <span className="text-lg font-semibold">Características</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getProductFeatures(selectedProduct).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Puja */}
              <div className="bg-[#171d26] p-6 rounded-xl">
                <div className="flex items-center gap-2 text-white mb-4">
                  <DollarSign size={24} className="text-[#fa7942]" />
                  <span className="text-xl font-bold">Realizar Puja</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Monto de tu puja ({selectedProduct.moneda || "COP"})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Mínimo: ${(getProductPrice(selectedProduct) + 1).toLocaleString()}`}
                        className="w-full pl-10 pr-4 py-4 bg-[#13171f] rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#fa7942] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-start gap-2 mt-2 text-xs text-gray-400">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>
                        Tu puja debe ser mayor a ${getProductPrice(selectedProduct).toLocaleString()}.
                        Se recomienda pujar al menos 5% más que el precio actual.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePlaceBid}
                      className="flex-1 py-4 bg-[#fa7942] hover:bg-[#ff9365] cursor-pointer rounded-lg text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Gavel size={20} />
                      Confirmar Puja
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardComprador;
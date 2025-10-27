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
  MapPin,
  Tag,
  AlertCircle,
} from "lucide-react";
import UserProfile from "../pages/UserProfile";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import Swal from 'sweetalert2';

var moneda = "COP";

const productsList = [
  {
    id: 1,
    name: "Ford Mustang GT",
    year: 2020,
    category: "autos",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbL0hrXKgU9P68VjfrE8IwHciIvkZKSKi38w&s",
    currentBid: 200000000,
    moneda,
    endDate: "2025-10-15",
    endTime: "18:00",
    status: "Activa",
    features: [
      "Motor V8 5.0L Coyote",
      "450 HP de potencia",
      "Sistema SYNC 3",
      "Performance Package incluido",
    ],
    location: "Subasta Premium Colombia",
    description:
      "Muscle car americano con motor V8, perfecto para amantes de la velocidad y el estilo clásico americano con tecnología moderna.",
    mechanicalAssistance: "Asistencia de la mecánica",
    baseLocation:
      "Base Multicarrural: Subasta Premium Colombia • Pujado al día",
  },
  {
    id: 2,
    name: "Laptop Gaming Pro",
    year: 2024,
    category: "tecnologia",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    currentBid: 3000000,
    moneda,
    endDate: "2025-10-12",
    endTime: "20:00",
    status: "Por finalizar",
    features: ["Intel Core i9", "32GB RAM", "RTX 4080", "Pantalla 165Hz"],
    location: "Subasta Tech Online",
    description:
      "Laptop gaming de alta gama para profesionales y gamers exigentes.",
  },
  {
    id: 3,
    name: "Pintura Original Contemporánea",
    year: 2023,
    category: "arte",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    currentBid: 1250000,
    moneda,
    endDate: "2025-10-18",
    endTime: "16:00",
    status: "Activa",
    features: [
      "Óleo sobre lienzo",
      "120 x 90 cm",
      "Certificado de autenticidad",
      "Marco incluido",
    ],
    location: "Galería Nacional",
    description:
      "Obra de arte contemporánea única, perfecta para coleccionistas.",
  },
  {
    id: 4,
    name: "Reloj de Lujo Suizo",
    year: 2022,
    category: "joyeria",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    currentBid: 400000,
    moneda,
    endDate: "2025-10-20",
    endTime: "22:00",
    status: "Activa",
    features: [
      "Acero inoxidable",
      "Movimiento automático",
      "Resistente al agua 300m",
      "Caja original",
    ],
    location: "Subasta Premium Luxury",
    description:
      "Reloj de lujo suizo con acabados premium y mecanismo de alta precisión.",
  },
  {
    id: 5,
    name: "Tesla Model 3",
    year: 2023,
    category: "autos",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    currentBid: 10000000,
    moneda,
    endDate: "2025-10-22",
    endTime: "14:00",
    status: "Próxima",
    features: [
      "Motor eléctrico",
      "Autopilot incluido",
      "Batería de largo alcance",
      "Carga rápida",
    ],
    location: "Subasta Premium Autos",
    description:
      "Vehículo eléctrico de última generación con tecnología avanzada.",
  },
  {
    id: 6,
    name: "Smartphone Pro Max",
    year: 2024,
    category: "tecnologia",
    image:
      "https://www.clevercel.co/cdn/shop/files/Portadas_iPhone14ProMax.webp?v=1757093052",
    currentBid: 500000,
    moneda,
    endDate: "2025-10-16",
    endTime: "18:00",
    status: "Activa",
    features: ["Pantalla OLED", "256GB", "5G", "Triple cámara"],
    location: "Subasta Tech",
    description:
      "Smartphone de última generación con las mejores prestaciones.",
  },
];

function DashboardComprador() {
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState("inicio");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
              <button className="relative p-2 hover:bg-slate-700 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff9365] rounded-full"></span>
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
    </div>
  );
}

// Componente de Inicio con datos del ProductContext
function InicioContent() {
  const [currentSlide] = useState(0);
  const { products, getProducts } = useProducts();
  const [imageIndex, setImageIndex] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const heroImages = [
    "https://wallpapers.com/images/hd/sunset-black-ford-mustang-gt-s7wq5lfz762uptye.jpg",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  ];

  const featuredProduct = productsList[currentSlide];

  // Cargar productos al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        if (!isMounted) return;
        
        setLocalLoading(true);

        const result = await getProducts();
        
        if (!isMounted) return;
        
        if (!result || result.length === 0) {
          Swal.fire({
            title: 'Sin productos',
            text: 'No hay productos en la base de datos o no se pudieron cargar.',
            icon: 'info',
            confirmButtonColor: '#fa7942',
            background: '#171d26',
            color: '#f7f9fb',
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        let errorMessage = 'No se pudieron cargar los productos.';
        
        if (error.message === 'Network Error') {
          errorMessage = 'No se puede conectar al backend. Verifica que esté corriendo en http://localhost:4000';
        } else if (error.response) {
          errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        }
        
        Swal.fire({
          title: 'Error',
          text: errorMessage,
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
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Función helper para obtener el nombre del producto (maneja ambos formatos)
  const getProductName = (product) => {
    return product.title || product.nombre || product.name || "Sin título";
  };

  // Función helper para obtener la descripción
  const getProductDescription = (product) => {
    return product.description || product.descripcion || "Sin descripción";
  };

  // Función helper para obtener la imagen
  const getProductImage = (product) => {
    return product.image || product.imagen || product.imageUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
  };

  // Función helper para obtener el precio
  const getProductPrice = (product) => {
    return product.startingPrice || product.precioInicial || product.precioActual || product.currentBid || 0;
  };

  // Función helper para obtener la fecha de fin
  const getProductEndDate = (product) => {
    if (product.dateEnd) {
      return new Date(product.dateEnd).toLocaleDateString('es-ES');
    }
    return product.fechaFin || product.endDate || "Por definir";
  };

  // Función helper para obtener ubicación
  const getProductLocation = (product) => {
    return product.location || product.ubicacion || "Ubicación no especificada";
  };

  // Función helper para obtener características
  const getProductFeatures = (product) => {
    return product.features || product.caracteristicas || [];
  };

  const calculateTimeLeft = (product) => {
    let endDate;
    
    if (product.dateEnd) {
      endDate = new Date(product.dateEnd);
    } 
    else if (product.fechaFin) {
      const endTime = product.horaFin || product.endTime || "23:59";
      endDate = new Date(`${product.fechaFin} ${endTime}`);
    } 
    else {
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

  const handleRefresh = async () => {
    try {
      setLocalLoading(true);
      await getProducts();
      Swal.fire({
        title: '¡Actualizado!',
        text: 'Productos actualizados correctamente',
        icon: 'success',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setLocalLoading(false);
    }
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
    const minimumBid = currentPrice * 1.05; // 5% más que el precio actual

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

    if (bidValue < minimumBid) {
      const result = await Swal.fire({
        title: 'Puja recomendada',
        html: `
          <p>Tu puja de <strong>$${bidValue.toLocaleString()}</strong> es válida pero baja.</p>
          <p>Se recomienda pujar al menos <strong>$${minimumBid.toLocaleString()}</strong> (5% más).</p>
          <p>¿Deseas continuar con tu puja actual?</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa7942',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, pujar',
        cancelButtonText: 'Cancelar',
        background: '#171d26',
        color: '#f7f9fb',
      });

      if (!result.isConfirmed) return;
    }

    // Aquí iría la lógica para enviar la puja al backend
    try {
      // TODO: Implementar llamada al API
      // await createBid(selectedProduct._id, bidValue);
      
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
      await getProducts(); // Actualizar lista de productos
      
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo registrar la puja. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#fa7942',
        background: '#171d26',
        color: '#f7f9fb',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1F29]">
      {/* Hero Section with Carousel */}
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
            <button
              onClick={handleRefresh}
              disabled={localLoading}
              className="px-4 py-2 bg-[#fa7942] rounded-lg hover:bg-[#ff9365] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {localLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar"
              )}
            </button>
          </div>

          {/* Estado de carga */}
          {localLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-[#fa7942] animate-spin mb-4" />
              <p className="text-gray-400">Cargando productos desde MongoDB...</p>
            </div>
          )}

          {/* Sin productos */}
          {!localLoading && products.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-4">
                <Gavel className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              </div>
              <p className="text-gray-400 text-lg mb-2">
                No hay productos disponibles en este momento
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Verifica tu conexión con el backend y MongoDB
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-[#fa7942] rounded-lg hover:bg-[#ff9365] transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid de productos del BACKEND */}
          {!localLoading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-[#1a2332] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 border border-gray-800/30 hover:border-blue-500/30 hover:-translate-y-1"
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={getProductName(product)}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-blue-500/90 backdrop-blur-sm">
                      <span className="text-white text-xs font-semibold">
                        {product.estado || product.status || "Activa"}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {getProductName(product)}
                    </h4>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {getProductDescription(product)}
                    </p>

                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1.5">
                        <TrendingUp size={14} className="text-green-500" />
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
                          <Clock size={16} className="text-orange-400" />
                        </div>
                        <span>{calculateTimeLeft(product)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <div className="p-1 bg-blue-500/10 rounded">
                          <Calendar size={16} className="text-blue-400" />
                        </div>
                        <span>{getProductEndDate(product)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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

      {/* Modal de Detalles del Producto (DATOS DEL BACKEND) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 h-screen flex items-center justify-center p-4 overflow-y-auto  z-[60]">
          <div className="bg-[#1a2332] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800/50 shadow-2xl">
            {/* Header del Modal */}
            <div className="relative">
              <img
                src={getProductImage(selectedProduct)}
                alt={getProductName(selectedProduct)}
                className="w-full h-80 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Sin+Imagen';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent rounded-t-2xl" />
              
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="absolute bottom-4 left-6">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-500/90 backdrop-blur-sm mb-2">
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
                <div className="bg-[#13171f] p-6 rounded-xl border border-gray-800/50">
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <TrendingUp size={20} className="text-green-500" />
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
                </div>

                {/* Tiempo Restante */}
                <div className="bg-[#13171f] p-6 rounded-xl border border-gray-800/50">
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

              {/* Características adicionales */}
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

              {/* Ubicación */}
              <div className="flex items-center gap-3 text-gray-300 bg-[#13171f] p-4 rounded-xl border border-gray-800/50">
                <MapPin size={20} className="text-red-500" />
                <span>{getProductLocation(selectedProduct)}</span>
              </div>

              {/* Sección de Puja */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 text-white mb-4">
                  <DollarSign size={24} className="text-green-500" />
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
                        placeholder={`Mínimo: ${(getProductPrice(selectedProduct) * 1.05).toLocaleString()}`}
                        className="w-full pl-10 pr-4 py-4 bg-[#13171f] border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
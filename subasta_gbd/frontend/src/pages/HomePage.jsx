import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Car,
  Palette,
  Laptop,
  Gem,
  Home,
  Bike,
  MapPin,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

var moneda = "COP";

const products = [
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

const categories = [
  {
    id: "autos",
    name: "Subastas: Autos",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  },
  {
    id: "arte",
    name: "Subastas de pintura",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  },
  {
    id: "tecnologia",
    name: "Subastas tecnológicas",
    icon: Laptop,
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    id: "joyeria",
    name: "Subastas de ropa y joyas",
    icon: Gem,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const heroImages = [
    "https://wallpapers.com/images/hd/sunset-black-ford-mustang-gt-s7wq5lfz762uptye.jpg",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredProduct = products[currentSlide];

  const calculateTimeLeft = (endDate, endTime) => {
    const end = new Date(`${endDate} ${endTime}`);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Finalizada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1F29]">
      {/* Header */}
      <header className="bg-[#1a2332] border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#fa7942]">SubastasNaPa</h2>

            <nav className="hidden md:flex gap-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Subastas activas
              </Link>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Categorías
              </Link>
            </nav>

            <div className="hidden md:flex gap-3">
              <Link
                to="/login"
                className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Register
              </Link>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Link
                to="/"
                className="block w-full text-left py-2 text-gray-300"
              >
                Home
              </Link>
              <Link
                to="/"
                className="block w-full text-left py-2 text-gray-300"
              >
                Subastas activas
              </Link>
              <Link
                to="/"
                className="block w-full text-left py-2 text-gray-300"
              >
                Categorías
              </Link>
              <div className="pt-2 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 border border-gray-600 rounded-lg text-white text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white text-center"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

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

      {/* Categories Section */}
      <section className="py-16 bg-[#0f1a2e]">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Categorías
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="relative group overflow-hidden rounded-xl aspect-square bg-gray-800 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="relative h-full flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <Icon
                      className="text-white mb-3 group-hover:scale-110 transition-transform"
                      size={40}
                    />
                    <span className="text-white text-sm font-semibold text-center">
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-[#1a2332] border-y border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="text-orange-500" size={24} />
            <h4 className="text-xl font-bold text-white">Filtrar Subastas</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0f1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6F3C] transition-colors"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[#0f1a2e] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6F3C] transition-colors"
            >
              <option value="all">Todas las categorías</option>
              <option value="autos">Autos</option>
              <option value="tecnologia">Tecnología</option>
              <option value="arte">Arte</option>
              <option value="joyeria">Joyería</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-[#0f1a2e] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6F3C] transition-colors"
            >
              <option value="all">Todos</option>
              <option value="Activa">Activa</option>
              <option value="Próxima">Próxima</option>
              <option value="Por finalizar">Por finalizar</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">
              Subastas Disponibles{" "}
              <span className="text-[#FF6F3C]">({filteredProducts.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#1a2332] rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Activa"
                        ? "bg-cyan-500 text-white"
                        : product.status === "Próxima"
                        ? "bg-orange-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.status}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#9BAEBB] transition-colors">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <TrendingUp size={16} className="text-green-400" />
                    <span>Puja actual</span>
                  </div>

                  <div className="flex">
                    <div className="text-3xl font-bold text-white mb-4 ">
                      ${product.currentBid.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-white mb-4 mx-2">
                      {product.moneda}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock size={16} className="text-orange-400" />
                      <span>
                        Tiempo restante:{" "}
                        {calculateTimeLeft(product.endDate, product.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} className="text-cyan-400" />
                      <span>Finaliza: {product.endDate}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2">
                    <Eye size={18} />
                    Ver Subasta
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No se encontraron productos con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1a2e] border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#fa7942]">
                SubastasNaPa
              </h2>
              <p className="text-gray-400 text-sm pt-4">
                La plataforma líder de subastas en línea. Encuentra productos
                únicos y ofertas excepcionales todos los días.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Enlaces Rápidos</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Cómo Funciona
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Categorías
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Subastas Activas
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Próximas Subastas
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Preguntas Frecuentes
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Términos y Condiciones
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Política de Privacidad
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Política de Reembolso
                </li>
                <li className="hover:text-[#FF6F3C] cursor-pointer transition-colors">
                  Reglas de Subasta
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Contacto</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400" />
                  Ocaña
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">📞</span>
                  +57 316193884

                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✉️</span>
                  contacto@SubastasNaPa.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 SubastasNaPa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

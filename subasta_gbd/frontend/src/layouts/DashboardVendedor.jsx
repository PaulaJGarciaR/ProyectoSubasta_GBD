import React, { useState } from "react";
import {
  Menu,
  Home,
  Gavel,
  Clock,
  Trophy,
  User,
  Bell,
  Search,
  X,
  DollarSign,  
  Package,    
  TrendingUp  
} from "lucide-react";
import ProductsPage from "../pages/ProductPage";
import UserProfile from "../pages/UserProfile";
import ProductFormPage from "../pages/ProductFormPage"; 
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2';

export default function DashboardVendedor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("inicio"); 
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const { logout, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleCloseModal = () => {
    setShowModal(false);
    setRefreshKey(prev => prev + 1); 
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 150);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "inicio":
        return <InicioContent onOpenModal={() => setShowModal(true)} refreshKey={refreshKey} />;
      case "productos":
        return <ProductsPage key={refreshKey} onRefresh={refreshKey} />;
      case "perfil":
        return <UserProfile onBack={() => handlePageChange("inicio")} />;
      default:
        return <InicioContent onOpenModal={() => setShowModal(true)} refreshKey={refreshKey} />;
    }
  };

  const handleLogout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro que deseas salir de tu cuenta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#fa7942',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    background: '#171d26',
    color: '#f7f9fb',
    customClass: {
      popup: 'border border-slate-700'
    }
  });

  if (result.isConfirmed) {
    // Mostrar mensaje de despedida
    await Swal.fire({
      title: '¡Hasta pronto!',
      text: 'Has cerrado sesión exitosamente',
      icon: 'success',
      confirmButtonColor: '#fa7942',
      background: '#171d26',
      color: '#f7f9fb',
      timer: 1500,
      showConfirmButton: false
    });
    
    // Ejecutar el logout
    logout();
  }
};

  return (
    <div className="flex h-screen bg-[#13171f] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-[88px]">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-[#171d26] border-b border-slate-700 p-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between  border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fa7942] rounded-lg flex items-center justify-center">
                  <button className="cursor-pointer" onClick={() => handlePageChange("inicio")}>
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
                    className="cursor-pointer  px-4 py-2 bg-[#fa7942] rounded-lg hover:bg-[#ff9365] "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className={`p-6 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderContent()}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171d26] rounded-lg border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-[#171d26] z-10">
              <h2 className="text-2xl font-bold text-white">Nueva Subasta</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Formulario */}
            <div className="p-6">
                <ProductFormPage onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Inicio
function InicioContent({ onOpenModal, refreshKey }) { 
  return (
    <>
      <main className=" px-8 py-4 w-full">
        {/* Sección de Bienvenida*/}
        <div className="mb-8 flex items-center justify-around">
          <div className="flex justify-between w-full">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Panel de Vendedor
              </h2>
              <p className="text-muted-foreground mt-1">
                Gestiona tus subastas y ventas
              </p>
            </div>
            <div>
              <button 
                onClick={onOpenModal} 
                className="bg-[#fa7942] flex px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-[#ff9365] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Nueva Subasta
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Stats Cards */}
       <div className=" py-4 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Ganancias potenciales */}
          <div className="bg-[#171d26] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  Ganancias potenciales
                </p>
                <h3 className="text-4xl font-bold text-white">
                  $6145
                </h3>
              </div>
              <div className="bg-[#13171f] p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">+12%</span> vs. mes anterior
            </p>
          </div>

          {/* Card 2 - Subastas activas */}
          <div className="bg-[#171d26] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  Subastas activas
                </p>
                <h3 className="text-4xl font-bold text-white">
                  5
                </h3>
              </div>
              <div className="bg-[#13171f] p-3 rounded-xl">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              2 terminan pronto
            </p>
          </div>

          {/* Card 3 - Total de ofertas */}
          <div className="bg-[#171d26] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  Total de ofertas
                </p>
                <h3 className="text-4xl font-bold text-white">
                  112
                </h3>
              </div>
              <div className="bg-[#13171f] p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              <span className="text-blue-600 font-medium">+23</span> hoy
            </p>
          </div>
        </div>
      </div>
    </div>
      <div>
        <ProductsPage key={refreshKey} onRefresh={refreshKey} />
      </div>
    </>
  );
}
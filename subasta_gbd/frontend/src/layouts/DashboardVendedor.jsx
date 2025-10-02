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
} from "lucide-react";
import ProductsPage from "../pages/ProductPage";
import UserProfile from "../pages/UserProfile";
import { useAuth } from "../context/AuthContext";


export default function DashboardVendedor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("inicio");
  const { logout,user} = useAuth();

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "inicio":
        return <InicioContent />;
      case "productos":
        return <ProductsPage />;
      case "perfil":
        return <UserProfile />;
      default:
        return <InicioContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#13171f] text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#171d26] transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fa7942] rounded-lg flex items-center justify-center">
              <Gavel className="w-6 h-6" />
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
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("inicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "inicio" ? "bg-[#fa7942]" : "hover:bg-slate-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </button>

          <button
            onClick={() => handleNavigation("productos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "productos"
                ? "bg-[#fa7942]"
                : "hover:bg-slate-700"
            }`}
          >
            <Gavel className="w-5 h-5" />
            <span>Productos</span>
          </button>

          <button
            onClick={() => handleNavigation("perfil")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "perfil" ? "bg-[#fa7942]" : "hover:bg-slate-700"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </button>

        </nav>
      </aside>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-[#171d26] border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
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
                <span className="absolute top-1 right-1 w-2 h-2 bg-ora[#ff9365] rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ora[#ff9365] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Usuario</p>
                  <p className="text-xs text-slate-400">
                    {user?.email || "email@ejemplo.com"}
                  </p>
                </div>
                <div><button
                    onClick={() => logout()}
                    className="cursor-pointer  px-4 py-2 bg-[#fa7942] rounded-lg hover:bg-[#ff9365] "
                  >
                    Logout
                  </button></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

// Componente de Inicio
function InicioContent() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#171d26] rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">
              Subastas Activas
            </h3>
            <Gavel className="w-5 h-5 text-[#ff9365]" />
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-green-400 mt-2">↑ 12% vs mes anterior</p>
        </div>

        <div className="bg-[#171d26] rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Mis Pujas</h3>
            <Clock className="w-5 h-5 text-[#fa7942]" />
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-slate-400 mt-2">En progreso</p>
        </div>

        <div className="bg-[#171d26] rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Ganadas</h3>
            <Trophy className="w-5 h-5 text-[#fa7942]" />
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-xs text-yellow-400 mt-2">Este mes</p>
        </div>

        <div className="bg-[#171d26] rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">
              Total Invertido
            </h3>
            <span className="text-[#fa7942] text-xl">$</span>
          </div>
          <p className="text-3xl font-bold">$2,450</p>
          <p className="text-xs text-slate-400 mt-2">USD</p>
        </div>
      </div>

    </>
  );
}


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
  const { logout } = useAuth();

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
      case "pujas":
        return <PujasContent />;
      case "ganadas":
        return <GanadasContent />;
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
            onClick={() => handleNavigation("pujas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "pujas" ? "bg-[#fa7942]" : "hover:bg-slate-700"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Mis Pujas</span>
          </button>

          <button
            onClick={() => handleNavigation("ganadas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "ganadas" ? "bg-[#fa7942]" : "hover:bg-slate-700"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Ganadas</span>
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
                    pjgarciar1@ufpso.edu.co
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">
              Subastas Activas
            </h3>
            <Gavel className="w-5 h-5 text-[#ff9365]" />
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-green-400 mt-2">↑ 12% vs mes anterior</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Mis Pujas</h3>
            <Clock className="w-5 h-5 text-[#fa7942]" />
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-slate-400 mt-2">En progreso</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Ganadas</h3>
            <Trophy className="w-5 h-5 text-[#fa7942]" />
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-xs text-yellow-400 mt-2">Este mes</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
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

      {/* Subastas Destacadas */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gavel className="w-6 h-6 text-[#fa7942]" />
          Subastas Destacadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-slate-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-[#fa7942] transition-all cursor-pointer"
            >
              <div className="h-48 bg-slate-600 flex items-center justify-center">
                <Gavel className="w-12 h-12 text-slate-500" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  Artículo de Subasta {item}
                </h3>
                <p className="text-sm text-slate-400 mb-3">
                  Descripción breve del artículo en subasta
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Puja Actual</p>
                    <p className="text-lg font-bold text-[#fa7942]">$500</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Termina en</p>
                    <p className="text-sm font-semibold">2h 34m</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-[#fa7942] hover:bg-[#ff9365] py-2 rounded-lg font-medium transition-colors">
                  Pujar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-[#fa7942]" />
                </div>
                <div>
                  <p className="font-medium">Nueva puja en "Artículo {item}"</p>
                  <p className="text-sm text-slate-400">Hace {item} hora(s)</p>
                </div>
              </div>
              <span className="text-[#fa7942] font-semibold">$450</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Componente de Mis Pujas
function PujasContent() {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-7 h-7 text-[#fa7942]" />
        Mis Pujas Activas
      </h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
                <Gavel className="w-8 h-8 text-[#fa7942]" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Artículo en Subasta {item}
                </p>
                <p className="text-sm text-slate-400">
                  Tu puja:{" "}
                  <span className="text-[#fa7942] font-semibold">
                    ${300 + item * 100}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Termina en: {item + 1}h {30 + item * 5}m
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-2">Estado</p>
              <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">
                Ganando
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Ganadas
function GanadasContent() {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-7 h-7 text-[#fa7942]" />
        Subastas Ganadas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-slate-700 rounded-lg overflow-hidden">
            <div className="h-48 bg-slate-600 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Artículo Ganado {item}</h3>
              <p className="text-sm text-slate-400 mb-3">
                Ganado hace {item} día(s)
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Precio Final</p>
                  <p className="text-lg font-bold text-green-400">
                    ${800 + item * 200}
                  </p>
                </div>
                <button className="bg-[#fa7942] hover:bg-[#ff9365] px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                  Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Mi Perfil
function PerfilContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-7 h-7 text-orange-500" />
          Mi Perfil
        </h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Usuario</h3>
            <p className="text-slate-400 mb-1">pjgarciar1@ufpso.edu.co</p>
            <p className="text-sm text-slate-500">Miembro desde Enero 2025</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors">
            Editar Perfil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Pujas Realizadas</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subastas Ganadas</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tasa de Éxito</span>
              <span className="font-semibold text-green-400">26.7%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Información de Contacto
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="font-medium">pjgarciar1@ufpso.edu.co</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Teléfono</p>
              <p className="font-medium">+57 123 456 7890</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Ubicación</p>
              <p className="font-medium">Bogotá, Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

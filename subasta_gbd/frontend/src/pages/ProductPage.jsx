import React, { useState } from 'react';
import { Gavel, Search, Clock } from 'lucide-react';

export default function ProductosPage() {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const productos = [
    { id: 1, nombre: 'Laptop Gaming', categoria: 'electronica', precio: 850, pujas: 23, tiempo: '3h 45m', estado: 'activo' },
    { id: 2, nombre: 'Reloj Vintage', categoria: 'accesorios', precio: 320, pujas: 15, tiempo: '1h 20m', estado: 'activo' },
    { id: 3, nombre: 'Cámara DSLR', categoria: 'electronica', precio: 1200, pujas: 45, tiempo: '5h 10m', estado: 'activo' },
    { id: 4, nombre: 'Pintura al Óleo', categoria: 'arte', precio: 2500, pujas: 8, tiempo: '12h 30m', estado: 'activo' },
    { id: 5, nombre: 'Zapatillas Deportivas', categoria: 'moda', precio: 180, pujas: 31, tiempo: '2h 15m', estado: 'activo' },
    { id: 6, nombre: 'Guitarra Eléctrica', categoria: 'instrumentos', precio: 650, pujas: 19, tiempo: '6h 40m', estado: 'activo' },
    { id: 7, nombre: 'Tablet Pro', categoria: 'electronica', precio: 450, pujas: 27, tiempo: '4h 05m', estado: 'activo' },
    { id: 8, nombre: 'Bolso de Cuero', categoria: 'accesorios', precio: 220, pujas: 12, tiempo: '8h 25m', estado: 'activo' },
  ];

  const productosFiltrados = productos.filter(p => {
    const matchCategoria = filtro === 'todos' || p.categoria === filtro;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const categorias = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'electronica', nombre: 'Electrónica' },
    { id: 'moda', nombre: 'Moda' },
    { id: 'arte', nombre: 'Arte' },
    { id: 'accesorios', nombre: 'Accesorios' },
    { id: 'instrumentos', nombre: 'Instrumentos' }
  ];

  return (
    <div>
      {/* Header con filtros */}
      <div className="bg-red-800 rounded-lg border border-slate-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Gavel className="w-7 h-7 text-orange-500" />
              Catálogo de Productos
            </h2>
            <p className="text-slate-400 text-sm">Explora y participa en nuestras subastas activas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltro(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filtro === cat.id ? 'bg-orange-500 text-white' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Productos encontrados */}
      <div className="mb-4 text-slate-400 text-sm">
        Mostrando {productosFiltrados.length} de {productos.length} productos
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition-all cursor-pointer group">
            <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center overflow-hidden">
              <Gavel className="w-16 h-16 text-slate-500 group-hover:scale-110 transition-transform" />
              <div className="absolute top-3 right-3 bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
                {producto.pujas} pujas
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs text-orange-400 font-medium uppercase">{producto.categoria}</span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
                {producto.nombre}
              </h3>
              
              <p className="text-sm text-slate-400 mb-4">
                Subasta activa con múltiples participantes
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400">Puja Actual</p>
                  <p className="text-xl font-bold text-orange-500">${producto.precio}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Termina en</p>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {producto.tiempo}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 py-2 rounded-lg font-medium text-sm transition-colors">
                  Pujar
                </button>
                <button className="px-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {productosFiltrados.length === 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
          <Gavel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-slate-400">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
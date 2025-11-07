// src/components/AdvancedFilters.jsx
import { useState } from 'react';
import { Search, Filter, X, DollarSign, MapPin, Tag, TrendingUp } from 'lucide-react';

export default function AdvancedFilters({ onApplyFilters, onClearFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    estado: '',  
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    withBids: false,
    hot: false,
    bargain: false
  });

  const categories = [
    { label: 'Todos', value: '' },
    { label: 'Autos', value: 'autos' },
    { label: 'Tecnología', value: 'tecnologia' },
    { label: 'Arte', value: 'arte' },
    { label: 'Joyería', value: 'joyeria' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Más recientes' },
    { value: 'price', label: 'Precio' },
    { value: 'dateEnd', label: 'Fecha de cierre' },
    { value: 'totalBids', label: 'Número de pujas' },
    { value: 'popular', label: 'Más populares' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApply = () => {
    console.log(' [AdvancedFilters] Aplicando filtros:', filters);
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      category: '',
      estado: '',  
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      withBids: false,
      hot: false,
      bargain: false
    };
    setFilters(clearedFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search' || key === 'minPrice' || key === 'maxPrice' || key === 'location') {
      return value !== '';
    }
    if (key === 'category') {
      return value !== '';
    }
    if (key === 'withBids' || key === 'hot' || key === 'bargain') {
      return value === true;
    }
    return false;
  }).length;

  return (
    <div className="relative">
      {/* Barra de búsqueda rápida y botón de filtros */}
      <div className="flex gap-3 mb-6">
        {/* Búsqueda rápida */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-3 bg-[#171d26] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-3 bg-[#171d26] border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2 relative"
        >
          <Filter size={20} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#fa7942] rounded-full flex items-center justify-center text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Botón aplicar búsqueda rápida */}
        <button
          onClick={handleApply}
          className="px-6 py-3 bg-[#fa7942] rounded-lg text-white hover:bg-[#ff9365] transition-colors font-semibold"
        >
          Buscar
        </button>
      </div>

      {/* Panel de filtros avanzados */}
      {isOpen && (
        <div className="mb-6 bg-[#171d26] border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter size={20} className="text-[#fa7942]" />
              Filtros Avanzados
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categoría */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                Categoría
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#13171f] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              >
                {categories.map(cat => (
                  <option key={cat.value || 'todos'} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio Mínimo */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                Precio Mínimo
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-[#13171f] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
            </div>

            {/* Precio Máximo */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                Precio Máximo
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Sin límite"
                className="w-full px-4 py-2.5 bg-[#13171f] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
            </div>

            {/* Ordenar por */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                Ordenar por
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#13171f] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Orden
              </label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#13171f] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={handleClear}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-[#fa7942] hover:bg-[#ff9365] rounded-lg text-white font-semibold transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
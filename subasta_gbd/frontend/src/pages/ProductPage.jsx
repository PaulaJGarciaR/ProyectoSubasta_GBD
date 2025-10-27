import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import {
  Eye,
  Trash2,
  Edit,
  Clock,
  DollarSign,
  Calendar,
  X,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductFormPage from "./ProductFormPage";
import Swal from "sweetalert2";

function ProductPage({ onRefresh }) {
  const { getMyProducts, products, deleteProduct } = useProducts();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getMyProducts(); // ← CAMBIAR
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  const formatDate = (date) => {
    const d = new Date(date);

    // Obtener componentes en hora local
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const month = months[d.getMonth()];

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const getTimeRemaining = (dateEnd) => {
    const now = new Date();
    const end = new Date(dateEnd);
    const diff = end - now;

    if (diff <= 0) return "Finalizada";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    getMyProducts();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId, productTitle = "esta subasta") => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar "${productTitle}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fa7942",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#171d26",
      color: "#f7f9fb",
      customClass: {
        popup: "border border-slate-700",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId);

        await Swal.fire({
          title: "¡Eliminado!",
          text: "La subasta ha sido eliminada exitosamente",
          icon: "success",
          confirmButtonColor: "#fa7942",
          background: "#171d26",
          color: "#f7f9fb",
          timer: 2000,
          showConfirmButton: false,
        });

         getMyProducts();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la subasta. Intenta de nuevo.",
          icon: "error",
          confirmButtonColor: "#fa7942",
          background: "#171d26",
          color: "#f7f9fb",
        });
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-[#13171f] min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#171d26] rounded-lg border border-[#242a37] p-12 text-center">
            <div className="bg-[#ff9365] p-4 w-16 h-16 rounded-lg mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#f7f9fb] mb-2">
              No hay subastas disponibles
            </h3>
            <div className="flex justify-center">
              <p className="text-[#D6DEE3]">
                Crea tu primera subasta para comenzar
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#13171f] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f7f9fb] mb-2">
              Mis Productos
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#171d26] rounded-lg overflow-hidden transition-all group"
            >
              <div className="relative h-48 overflow-hidden bg-[#242a37]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Sin+Imagen";
                  }}
                />
                <div className="absolute top-3 right-3 bg-[#fa7942] px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-[#13171f] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(product.dateEnd)}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-[#f7f9fb] group-hover:text-[#fa7942] transition-colors line-clamp-1">
                  {product.title}
                </h3>

                <p className="text-sm text-[#D6DEE3] mb-4 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9BAEBB] flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Precio Inicial
                    </span>
                    <span className="text-lg font-bold text-[#fa7942]">
                      ${product.startingPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#9BAEBB]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Inicio
                    </span>
                    <span>{formatDate(product.dateStart)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#9BAEBB]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Finaliza
                    </span>
                    <span>{formatDate(product.dateEnd)}</span>
                  </div>
                </div>

                <div className="border-t border-[#242a37] pt-4 flex gap-4 justify-center">
                  <div className="flex justify-evenly w-full gap-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-[#13171f] hover:bg-[#1a2029] flex-1 text-center font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleViewClick(product)}
                      className="bg-[#13171f] hover:bg-[#1a2029] flex-1 text-center font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => handleDelete(product._id, product.title)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171d26] rounded-lg border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-[#171d26] z-10">
              <h2 className="text-2xl font-bold text-white">Editar Subasta</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <ProductFormPage
                productToEdit={selectedProduct}
                onClose={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171d26] rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="relative">
              <button
                onClick={handleCloseViewModal}
                className="absolute top-4 right-4 p-2 bg-[#13171f] hover:bg-slate-700 rounded-lg transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Imagen del Producto */}
              <div className="relative h-80 overflow-hidden rounded-t-lg bg-[#242a37]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=Sin+Imagen";
                  }}
                />
                <div className="absolute top-4 right-16 bg-[#fa7942] px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-[#13171f]">
                    {getTimeRemaining(selectedProduct.dateEnd)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Título */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedProduct.title}
                </h2>
                <p className="text-[#D6DEE3] text-sm">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Grid de Información */}
              <div className="grid grid-cols-2 gap-4">
                {/* Oferta Actual */}
                <div className="bg-[#13171f] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#9BAEBB] text-sm mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Oferta actual</span>
                  </div>
                  <p className="text-3xl font-bold text-[#4ade80]">
                    ${selectedProduct.startingPrice.toFixed(2)}
                  </p>
                </div>

                {/* Total de Ofertas */}
                <div className="bg-[#13171f] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#9BAEBB] text-sm mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Total de ofertas</span>
                  </div>
                  <p className="text-3xl font-bold text-[#4ade80]">34</p>
                </div>

                {/* Tiempo Restante */}
                <div className="bg-[#13171f] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#9BAEBB] text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Tiempo restante</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {getTimeRemaining(selectedProduct.dateEnd)}
                  </p>
                </div>

                {/* Vistas Totales */}
                <div className="bg-[#13171f] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#9BAEBB] text-sm mb-2">
                    <Eye className="w-4 h-4" />
                    <span>Vistas totales</span>
                  </div>
                  <p className="text-2xl font-bold text-white">179</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="border-t border-slate-700 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#9BAEBB] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de inicio
                  </span>
                  <span className="text-white font-medium">
                    {formatDate(selectedProduct.dateStart)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9BAEBB] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de finalización
                  </span>
                  <span className="text-white font-medium">
                    {formatDate(selectedProduct.dateEnd)}
                  </span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseViewModal}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;

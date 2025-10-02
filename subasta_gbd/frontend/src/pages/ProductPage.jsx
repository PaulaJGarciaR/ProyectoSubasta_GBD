import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { Eye, Trash2, Edit, Clock, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';function ProductPage() {
  const { getProducts, products } = useProducts();

  const {deleteProduct} = useProducts()
  

  useEffect(() => {
    getProducts();
  }, [getProducts]);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dateEnd) => {
    const now = new Date();
    const end = new Date(dateEnd);
    const diff = end - now;
    
    if (diff <= 0) return 'Finalizada';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
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
            <h3 className="text-2xl font-bold text-[#f7f9fb] mb-2">No hay subastas disponibles</h3>
             <div className='flex justify-center'>
               <p className="text-[#D6DEE3]">Crea tu primera subasta para comenzar</p>
          <Link to='/add-product' className='bg-[#fa7942] px-2 ml-3 rounded-lg font-semibold'>+</Link>
        </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#13171f] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className='flex items-center justify-between'>
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f7f9fb] mb-2">Mis Productos</h1>
          <p className="text-[#D6DEE3]">Gestiona tus productos en subasta</p>
        </div>

        <div className=''>
          <Link to='/add-product' className='bg-[#fa7942] rounded-lg cursor-pointer p-4 text-2xl font-semibold'>+</Link>
        </div>

        </div>
        


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#171d26] rounded-lg overflow-hidden border border-[#242a37] hover:border-[#fa7942] transition-all group"
            >
              <div className="relative h-48 overflow-hidden bg-[#242a37]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
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
                  <div className=' flex justify-evenly w-[80%]'>
                    <Link className='bg-[#13171f] w-[60%] text-center font-semibold text-lg px-6 rounded-lg items-center cursor-pointer' to={`/dashboardvendedor/${product._id}`}>Editar</Link>
                 
                  <button
                    onClick={() => {deleteProduct(product._id)}}
                    className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
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
    </div>
  );
}




export default ProductPage;
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="w-full">
      <nav className="flex items-center justify-between bg-[#1F3B4D] px-8 py-4 text-white">
        <div className="text-2xl font-bold">Subastas.com</div>
        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-gray-200">
              Subastas activas
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-gray-200">
              Categorías
            </Link>
          </li>
        </ul>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="bg-transparent border-3 border-white px-6 py-2 rounded-xl text-white font-bold hover:bg-white hover:text-[#FF6F3C]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#FF6F3C] px-6 py-3 rounded-xl font-semibold text-white hover:bg-[#F9A26C]"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="bg-[#D6DEE3] min-h-screen flex justify-center ">
      <div className="bg-white w-[90%] min-h-[700px] shadow-2xl overflow-hidden ">
        <div className="relative h-[500px] overflow-hidden">
          <img 
            src="https://img.freepik.com/foto-gratis/coche-conceptual-batmobile-luces-neon_23-2151649891.jpg?semt=ais_incoming&w=740&q=80" 
            alt="Subasta de Salvamentos - Todos los Martes"
            className="w-full h-full object-cover"
          />
          

          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/70 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <div className="text-white max-w-md">
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">SUBASTA DE SALVAMENTOS</h1>
              <h2 className="text-3xl font-bold mb-4 text-[#F47C3C] drop-shadow-lg">TODOS LOS MARTES</h2>
              <div className="inline-block bg-[#F47C3C] text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                AHORA TODOS PUEDEN PARTICIPAR
              </div>
            </div>
            
           
          </div>
          
          <div className="absolute bottom-4 left-8 flex items-center space-x-4 text-white text-sm">
            <div className="bg-[#1F3B4D]/80 backdrop-blur-sm px-3 py-1 rounded border border-white/20">
              <span className="font-medium">🔍 LUNES: INSPECCIÓN DISPONIBLE</span>
            </div>
            <div className="bg-[#1F3B4D]/80 backdrop-blur-sm px-3 py-1 rounded border border-white/20">
              <span className="font-medium">🔨 MARTES: SUBASTA GENERAL</span>
            </div>
          </div>
        </div>

        {/*  categorías  */}
        <div className="p-8 bg-gradient-to-b from-white to-[#D6DEE3]/20">
          <h3 className="text-[#1F3B4D] text-2xl font-bold mb-8 text-center">Categorías</h3>
          
          <div className="grid grid-cols-4 gap-6 mb-10">
            {/* Categoría 1: Subastas autos */}
            <div className="relative overflow-hidden rounded-xl h-40 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1441148345475-03a2e82f9719?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9uZG8lMjBkZSUyMHBhbnRhbGxhJTIwZGUlMjBjb2NoZXN8ZW58MHx8MHx8fDA%3D" 
                alt="Velocímetro" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <div className="w-10 h-10 bg-[#F47C3C] rounded-full mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="10" cy="10" r="3" fill="currentColor"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-sm drop-shadow-lg">Subastas Autos</h4>
              </div>
            </div>

            {/* Categoría 2: Subastas de pinturas */}
            <div className="relative overflow-hidden rounded-xl h-40 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://wallpapers.com/images/hd/canvas-pictures-2ym8jirlhx74obrh.jpg" 
                alt="Galería de arte" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <div className="w-10 h-10 bg-blue-500 rounded-full mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM5 6v8h10V6H5z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-sm drop-shadow-lg">Subastas de pinturas</h4>
              </div>
            </div>

            {/* Categoría 3: Subastas tecnológicas */}
            <div className="relative overflow-hidden rounded-xl h-40 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" 
                alt="Tecnología" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <div className="w-10 h-10 bg-purple-500 rounded-full mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-sm drop-shadow-lg">Subastas tecnológicas</h4>
              </div>
            </div>

            {/* Categoría 4: Subastas de ropa y joyas */}
            <div className="relative overflow-hidden rounded-xl h-40 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Joyería y oro" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <div className="w-10 h-10 bg-[#F9A26C] rounded-full mb-3 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L12.09 8.26L18 10L12.09 11.74L10 18L7.91 11.74L2 10L7.91 8.26L10 2Z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-sm drop-shadow-lg">Subastas de ropa y joyas</h4>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1F3B4D] to-[#182F3E] rounded-2xl overflow-hidden flex shadow-2xl">
            carrusel  
          </div>
        </div>

        {/* Footer  */}
        <div className="bg-gradient-to-r from-[#9BAEBB] to-[#5C7C91] px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#F47C3C] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white font-semibold text-lg">Subastas.com</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-white">
              <a href="#" className="hover:text-[#F47C3C] transition-colors font-medium">Terms & Conditions</a>
              <a href="#" className="hover:text-[#F47C3C] transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-[#F47C3C] transition-colors font-medium">Contact Us</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#F47C3C] font-semibold">Social Accounts</span>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <span className="text-white text-sm font-bold">@</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
            
    </div>
  );
}

export default HomePage;

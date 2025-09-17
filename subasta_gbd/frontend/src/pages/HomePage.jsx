import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="w-full">
      <nav className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">
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

      

      {/* <section className="bg-yellow-400 h-screen flex  justify-center">
        <div className="bg-[#5C2C00] w-[90%] h-[500px] flex items-center  text-white">

        </div>
      </section> */}
    </div>
  );
}

export default HomePage;

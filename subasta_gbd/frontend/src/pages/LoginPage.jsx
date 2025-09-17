import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function LoginPage() {

  const navigate = useNavigate();

   const irRegister = () => {
    navigate('/register'); 
  };

  return (
    <div className="bg-[#1F3B4D] h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className=" w-[50%]">
          <div className="flex justify-center w-[100%]">
            <div className="w-[55%] bg-white rounded-l-2xl relative ">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#FF6F3C] rounded-full z-10 flex justify-center">
                <div className="flex justify-center items-center">
                  <a  href="/" className="flex justify-center ">
                    <svg
                      className="w-6 h-6 text-white dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="text-center mt-8">
                <h1 className="text-2xl font-semibold">Bienvenidos a</h1>
                <h2 className="text-4xl font-bold">Subastas.com</h2>
              </div>

              <form className=" w-[100%]" action="">
                <div className="flex justify-center">
                  <div className="w-[80%]">
                    <input
                      type="email"
                      placeholder="email"
                      className="mt-10 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                    />
                    <input
                      id="password"
                      type="password"
                      placeholder="Contraseña"
                      className="mt-10 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <a className="font-semibold text-[#FF6F3C]" href="">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div className="flex justify-center items-center m-8">
                  <button className="bg-[#FF6F3C] px-6 py-3 rounded-xl font-bold text-white hover:bg-[#F9A26C]">
                    Ingresar
                  </button>
                </div>
              </form>
            </div>
            <div className=" w-[45%] bg-[#FF6F3C] flex justify-center items-center">
              <div className="block">
                <h1 className="text-white font-bold text-sm">
                  ¿Aún no eres parte de Subasta.com?
                </h1>
                <div className="flex justify-center mt-4">
                  <button onClick={irRegister} className="bg-transparent border-3 border-white px-6 py-2 rounded-xl text-white font-bold hover:bg-white hover:text-[#FF6F3C] cursor-pointer">
                    Registrate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;

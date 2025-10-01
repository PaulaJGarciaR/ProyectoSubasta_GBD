import { useForm } from "react-hook-form";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin,errors:loginErrors,isAuthenticated } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const irRegister = () => {
    navigate("/register");
  };

  useEffect(()=> {
    if(isAuthenticated) navigate("/dashboardvendedor")
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isAuthenticated]);

  return (
    <div className="bg-[#13171f] h-screen">
      <div className="min-h-screen  overflow-hidden relative">
        {/* Círculos flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Círculo mediano - arriba izquierda */}
          <div
            className="absolute w-24 h-24 bg-[#fa7942]/10 rounded-full"
            style={{
              left: "5%",
              top: "10%",
              animation: "float 8s ease-in-out infinite",
            }}
          ></div>

          {/* Círculo pequeño - arriba derecha */}
          <div
            className="absolute w-20 h-20 bg-[#fa7942]/15 rounded-full"
            style={{
              right: "5%",
              top: "15%",
              animation: "float 10s ease-in-out infinite 2s",
            }}
          ></div>

          {/* Círculo pequeño - centro izquierda */}
          <div
            className="absolute w-20 h-20 bg-[#fa7942]/15 rounded-full"
            style={{
              left: "8%",
              top: "50%",
              animation: "float 12s ease-in-out infinite 4s",
            }}
          ></div>

          {/* Círculo mediano - abajo derecha */}
          <div
            className="absolute w-24 h-24 bg-[#fa7942]/10 rounded-full"
            style={{
              right: "4%",
              bottom: "10%",
              animation: "float 9s ease-in-out infinite 1s",
            }}
          ></div>

          {/* Círculo pequeño - centro derecha */}
        </div>

        {/* Estilos CSS para la animación de flotación */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}</style>

        {/* Área de contenido */}
        <div className="relative flex justify-center items-center h-screen">
          <div className=" w-[50%]">
            <div className="flex justify-center w-[100%]">
              <div className="w-[50%] bg-[#171d26] rounded-l-lg ">
                <div className="mt-8">
                  <h1 className="text-[#f7f9fb] font-bold text-lg text-center">
                    Bienvenido a
                  </h1>
                </div>
                <div className="text-center mt-2 flex justify-center">
                  <div className="bg-[#ff9365] p-2 w-12 h-12 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-full"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#fa7942]">
                      SubastasNaPa
                    </h2>
                    <p className="text-sm  text-[#f7f9fb]">
                      Tu casa de subastas digital.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <p className="text-sm text-center text-[#f7f9fb]/50 w-[80%]">
                    Accede a tu cuenta para participar en las mejores subastas
                  </p>
                </div>
                <div className="flex flex-col justify-center mt-2">
                    <div className="w-[100%]">
                      {loginErrors.map((error, i) => (
                        <div
                          className="bg-[#E53935] p-2 text-white mb-2 font-semibold"
                          key={i}
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                

                <form onSubmit={onSubmit} className=" w-[100%]" action="">
                  <div className="flex justify-center">
                    <div className="w-[80%]">
                      <div>
                        <label
                          htmlFor=""
                          className="text-sm text-[#D6DEE3] pb-2 font-semibold"
                        >
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          {...register("email", {
                            required: "Campo obligatorio*",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Email inválido",
                            },
                          })}
                          className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb]  focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                        />
                        {errors.email && (
                          <p className="text-[#E53935] font-semibold text-sm">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor=""
                          className="text-sm text-[#D6DEE3] pb-2 font-semibold"
                        >
                          Contraseña
                        </label>
                        <input
                          id="password"
                          type="password"
                          {...register("password", {
                            required: "Campo obligatorio*",
                          })}
                          className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb]  focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                        />
                        {errors.password && (
                          <p className="text-[#E53935] font-semibold text-sm">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-8">
                    <a className="font-semibold text-[#FF6F3C]" href="">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <div className="flex justify-center items-center m-8">
                    <button className="bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 cursor-pointer">
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
              <div className="bg-gradient-to-b w-[50%] rounded-r-sm from-[#fa7942] to-[#ff9365] flex justify-center items-center">
                <div className="block w-[80%]">
                  <h1 className="text-[#13171f] font-bold text-xl text-center">
                    ¿Aún no eres parte de SubastasNaPa?
                  </h1>
                  <p className="text-md text-[#202630] mt-4">
                    Únete a miles de coleccionistas y encuentra piezas únicas en
                    nuestras subastas exclusivas.
                  </p>
                  <div className="flex justify-center mt-4 ">
                    <button
                      onClick={irRegister}
                      className="w-full bg-transparent border-2 border-[#13171f] px-6 py-2 rounded-lg text-[#13171f] font-semibold hover:bg-[#13171f] hover:text-[#fa7942] cursor-pointer"
                    >
                      Registrate
                    </button>
                  </div>
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

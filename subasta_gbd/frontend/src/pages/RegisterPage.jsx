import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

  const irLogin = () => {
    navigate("/login");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [selectedOption, setSelectedOption] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    console.log("Datos:", data);
    const res = await registerRequest(data);
    console.log(res);
  });

  const isTabBlocked = (tabName) => {
    if (tabName === "tab2" && selectedOption === "opcion2") {
      return true; // Bloquea la pestaña 2 si se selecciona "opcion1"
    }
    return false;
  };

  // Función para cambiar pestaña (con validación)
  const handleTabChange = (tabName) => {
    if (!isTabBlocked(tabName)) {
      setActiveTab(tabName);
    }
  };

  return (
    <div className=" min-h-screen bg-[#1F3B4D] py-6">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-[80%]">
          <div className="flex justify-center w-[100%]">
            <div className="w-[65%] bg-white  relative">
              {/*Icono de regresar al inicio*/}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#0F1F29] rounded-full z-10 flex justify-center">
                <div className="flex justify-center items-center">
                  <a href="/" className="flex justify-center ">
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
              <div>
                {/*Parte superior del formulario*/}
                <div className="bg-[#FF6F3C] flex justify-center">
                  <div className="block w-[100%]">
                    <h1 className="text-white text-center text-4xl font-bold">
                      Crea tu cuenta
                    </h1>
                    <div className=" flex justify-center my-4 ">
                      <div className="w-[50%]">
                        <select
                          value={selectedOption}
                          onChange={(e) => {
                            setSelectedOption(e.target.value);
                            // Si selecciona "Comprador" y está en tab2, cambiar a tab1
                            if (
                              e.target.value === "opcion2" &&
                              activeTab === "tab2"
                            ) {
                              setActiveTab("tab1");
                            }
                          }}
                          className="w-full p-2 border border-white rounded bg-white"
                        >
                          <option value="">Tipo de Usuario</option>
                          <option value="opcion1">Vendedor</option>
                          <option value="opcion2">Comprador</option>
                        </select>
                      </div>
                    </div>
                    {/* Botones de las pestañas*/}
                    <div className="flex bg-gray-100">
                      <button
                        onClick={() => setActiveTab("tab1")}
                        className={`flex-1 py-3 px-4 font-medium transition-all ${
                          activeTab === "tab1"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        📝 Personal
                      </button>

                      <button
                        onClick={() => handleTabChange("tab2")} // 👈 Cambiar esto
                        disabled={isTabBlocked("tab2")} // 👈 Y esto
                        className={`flex-1 py-3 px-4 font-medium transition-all ${
                          isTabBlocked("tab2") // 👈 Y esto también
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            : activeTab === "tab2" // 👈 Y esto
                            ? "bg-white text-[#FF6F3C] shadow-sm border-b-2 border-[#FF6F3C]"
                            : "text-gray-500 hover:text-gray-700 cursor-pointer"
                        }`}
                      >
                        💼 Profesional
                        {isTabBlocked("tab2") && (
                          <span className="ml-1">🔒</span>
                        )}{" "}
                        {/* 👈 Y esto */}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Contenido de Pestaña 1 */}
                {activeTab === "tab1" && (
                  <div className="flex justify-center items-center">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4  w-[90%]"
                    >
                      {/* Nombres */}
                      <div className="grid grid-cols-2 gap-4 ">
                        <div>
                          <input
                            {...register("firstName", {
                              required: "Requerido",
                            })}
                            placeholder="Primer Nombre"
                            className="mt-8 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("middleName")}
                            placeholder="Segundo Nombre"
                            className="mt-8 p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            {...register("lastName", { required: "Requerido" })}
                            placeholder="Primer Apellido"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("secondLastName")}
                            placeholder="Segundo Apellido"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                        </div>
                      </div>

                      {/* Documento */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <select
                            {...register("documentType", {
                              required: "Requerido",
                            })}
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          >
                            <option value="">Tipo de documento</option>
                            <option value="cedula">Cédula</option>
                            <option value="pasaporte">Pasaporte</option>
                          </select>
                          {errors.documentType && (
                            <p className="text-red-500 text-sm">
                              {errors.documentType.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("documentNumber", {
                              required: "Requerido",
                            })}
                            placeholder="Número de Documento"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.documentNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.documentNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Fechas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#5C7C91]">
                            Fecha Expedición *
                          </label>
                          <input
                            type="date"
                            {...register("documentIssueDate", {
                              required: "Requerido",
                            })}
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.documentIssueDate && (
                            <p className="text-red-500 text-sm">
                              {errors.documentIssueDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#5C7C91]">
                            Fecha Nacimiento *
                          </label>
                          <input
                            type="date"
                            {...register("birthDate", {
                              required: "Requerido",
                            })}
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.birthDate && (
                            <p className="text-red-500 text-sm">
                              {errors.birthDate.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <input
                            {...register("country", { required: "Requerido" })}
                            placeholder="País"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm">
                              {errors.country.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("state", { required: "Requerido" })}
                            placeholder="Estado"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm">
                              {errors.state.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("city", { required: "Requerido" })}
                            placeholder="Ciudad"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <input
                          {...register("address", { required: "Requerido" })}
                          placeholder="Dirección"
                          className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm">
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="email"
                            {...register("email", {
                              required: "Requerido",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Email inválido",
                              },
                            })}
                            placeholder="Email"
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            {...register("phone", { required: "Requerido" })}
                            className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                            placeholder="Teléfono"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contraseña */}
                      <div>
                        <input
                          type="password"
                          {...register("password", {
                            required: "Requerido",
                            minLength: {
                              value: 8,
                              message: "Mínimo 8 caracteres",
                            },
                          })}
                          placeholder="Contraseña"
                          className=" p-3 w-full rounded-lg bg-[#D6DEE3]/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9BAEBB]"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Botones */}
                      <div className="flex gap-4 pt-4 my-4">
                        <button
                          type="submit"
                          className="flex-1 bg-[#1F3B4D] text-white py-2 rounded hover:bg-[#9BAEBB] font-semibold"
                        >
                          Registrarse
                        </button>

                        <button
                          type="button"
                          onClick={() => reset()}
                          className="flex-1 bg-[#5C7C91] text-white py-2 rounded hover:bg-[#9BAEBB] font-semibold"
                        >
                          Limpiar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {activeTab === "tab2" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">
                      Información Profesional
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre de tu empresa"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        placeholder="Tu posición actual"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Años de Experiencia
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Selecciona tu experiencia</option>
                        <option value="0-1">0-1 años</option>
                        <option value="2-5">2-5 años</option>
                        <option value="6-10">6-10 años</option>
                        <option value="10+">Más de 10 años</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className=" bg-[#FF6F3C] flex justify-center items-center">
                  <div className="block py-2.5">
                    <h1 className="text-white font-bold text-sm">
                      ¿Ya eres parte de Subasta.com?
                    </h1>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={irLogin}
                        className="bg-transparent border-3 border-white px-6 py-2 rounded-xl text-white font-bold hover:bg-white hover:text-[#FF6F3C] cursor-pointer"
                      >
                        Inicia Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="max-w-2xl mx-auto p-6 ">
    //   <h1 className="text-2xl font-bold mb-6">Registro</h1>

    // <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

    //   {/* Nombres */}
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Primer Nombre *</label>
    //       <input
    //         {...register('firstName', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Segundo Nombre</label>
    //       <input {...register('middleName')} className="w-full p-2 border rounded" />
    //     </div>
    //   </div>

    //   {/* Apellidos */}
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Primer Apellido *</label>
    //       <input
    //         {...register('lastName', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Segundo Apellido</label>
    //       <input {...register('secondLastName')} className="w-full p-2 border rounded" />
    //     </div>
    //   </div>

    //   {/* Documento */}
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Tipo Documento *</label>
    //       <select
    //         {...register('documentType', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       >
    //         <option value="">Seleccionar</option>
    //         <option value="cedula">Cédula</option>
    //         <option value="pasaporte">Pasaporte</option>
    //       </select>
    //       {errors.documentType && <p className="text-red-500 text-sm">{errors.documentType.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Número Documento *</label>
    //       <input
    //         {...register('documentNumber', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.documentNumber && <p className="text-red-500 text-sm">{errors.documentNumber.message}</p>}
    //     </div>
    //   </div>

    //   {/* Fechas */}
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Fecha Expedición *</label>
    //       <input
    //         type="date"
    //         {...register('documentIssueDate', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.documentIssueDate && <p className="text-red-500 text-sm">{errors.documentIssueDate.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Fecha Nacimiento *</label>
    //       <input
    //         type="date"
    //         {...register('birthDate', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
    //     </div>
    //   </div>

    //   {/* Ubicación */}
    //   <div className="grid grid-cols-3 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">País *</label>
    //       <input
    //         {...register('country', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Estado *</label>
    //       <input
    //         {...register('state', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Ciudad *</label>
    //       <input
    //         {...register('city', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
    //     </div>
    //   </div>

    //   {/* Dirección */}
    //   <div>
    //     <label className="block text-sm font-medium mb-1">Dirección *</label>
    //     <input
    //       {...register('address', { required: 'Requerido' })}
    //       className="w-full p-2 border rounded"
    //     />
    //     {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
    //   </div>

    //   {/* Contacto */}
    //   <div className="grid grid-cols-2 gap-4">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">Email *</label>
    //       <input
    //         type="email"
    //         {...register('email', {
    //           required: 'Requerido',
    //           pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
    //         })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Teléfono *</label>
    //       <input
    //         {...register('phone', { required: 'Requerido' })}
    //         className="w-full p-2 border rounded"
    //       />
    //       {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
    //     </div>
    //   </div>

    //   {/* Contraseña */}
    //   <div>
    //     <label className="block text-sm font-medium mb-1">Contraseña *</label>
    //     <input
    //       type="password"
    //       {...register('password', {
    //         required: 'Requerido',
    //         minLength: { value: 8, message: 'Mínimo 8 caracteres' }
    //       })}
    //       className="w-full p-2 border rounded"
    //     />
    //     {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
    //   </div>

    //   {/* Botones */}
    //   <div className="flex gap-4 pt-4">
    //     <button
    //       type="submit"
    //       className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    //     >
    //       Registrarse
    //     </button>

    //     <button
    //       type="button"
    //       onClick={() => reset()}
    //       className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
    //     >
    //       Limpiar
    //     </button>
    //   </div>
    // </form>
    // </div>
  );
}

export default RegisterPage;

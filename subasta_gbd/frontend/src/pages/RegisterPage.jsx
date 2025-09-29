import { useForm } from "react-hook-form";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

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
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const [selectedOption, setSelectedOption] = useState("");

  const personType = watch("personType");

  const {
    signup,
    isAuthenticated,
    errors: registerErrors,
    clearErrors,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  });
  

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Crear copia de los datos del formulario
      const cleanData = { ...values };

      console.log("🔍 Datos recibidos del formulario:", values);
      console.log("🔍 Tipo de persona detectado:", cleanData.personType);
      console.log("🔍 Tipo de usuario detectado:", cleanData.userType);

      // Determinar el tipo de persona - usar personType del tab2 si existe
      const isPersonaNatural = cleanData.personType === "natural";
      const isPersonaJuridica = cleanData.personType === "juridica";
      const isCompradorSinPersonType =
        cleanData.userType === "comprador" && !cleanData.personType;

      if (isPersonaNatural) {
        console.log("Limpiando datos para PERSONA NATURAL");

        delete cleanData.razonSocial;
        delete cleanData.nitPersonaJuridica;
        delete cleanData.fechaDeConstitucion;
        delete cleanData.sociedad;
        delete cleanData.matriculaMercantil;

        cleanData.personType = "natural";
      } else if (isPersonaJuridica) {
        console.log("Limpiando datos para PERSONA JURÍDICA");

        cleanData.personType = "juridica";
      } else if (isCompradorSinPersonType) {
        console.log(
          "Usuario comprador - usando solo datos personales del tab1"
        );

        delete cleanData.razonSocial;
        delete cleanData.nitPersonaJuridica;
        delete cleanData.fechaDeConstitucion;
        delete cleanData.sociedad;
        delete cleanData.matriculaMercantil;
        delete cleanData.nitPersonaNatural;
        delete cleanData.personType;

        cleanData.userType = "comprador";
      } else {
        console.error("Tipo de persona no definido o inválido");
        console.log(" personType:", cleanData.personType);
        console.log(" userType:", cleanData.userType);
        alert(
          "Debe seleccionar el tipo de persona (Natural o Jurídica) para vendedores"
        );
        return;
      }

      console.log("Datos limpios antes de enviar:", cleanData);

      console.log(" Respuesta del registro:");

      signup(cleanData);
    } catch (error) {
      console.error(" Error en el registro:", error);

      if (error.response?.data?.fields) {
        console.log("Campos que fallan:");
        error.response.data.fields.forEach((field, index) => {
          console.log(`Campo ${index + 1}:`, field);
        });
      }
    }
  });

  const isTabBlocked = (tabName) => {
    if (tabName === "tab2" && selectedOption === "comprador") {
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

  const PersonaNaturalForm = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-semibold text-[#f7f9fb] mb-4">
        Persona Natural
      </h3>
      <div>
        <label htmlFor="" className="text-[#f7f9fb] text-sm font-semibold">
          NIT (Número de Identificación Tributaria)
        </label>
        <input
          {...register("nitPersonaNatural", {
            required: "Campo Obligatorio*",
          })}
          className="text-[#f7f9fb] mt-2 p-3 w-full rounded-lg bg-[#242a37] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        />
        {errors.nitPersonaNatural && (
          <p className="text-[#E53935] font-semibold text-sm">
            {errors.nitPersonaNatural.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4 my-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 cursor-pointer "
        >
          Registrarse
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            clearErrors();
          }}
          className="flex-1 bg-[#13171f] text-white py-2 rounded hover:bg-[#202630] font-semibold cursor-pointer"
        >
          Limpiar
        </button>
      </div>
    </div>
  );

  const PersonaJuridicaForm = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-semibold text-[#f7f9fb] mb-4">
        Persona Juridica
      </h3>
      <div>
        <label htmlFor="" className="text-[#f7f9fb] text-sm font-semibold">
          Razón Social
        </label>
        <input
          {...register("razonSocial",{
            required: "Campo Obligatorio*",
          })}
          className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        />
        {errors.razonSocial && (
          <p className="text-[#E53935] font-semibold text-sm">
            {errors.razonSocial.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="" className="text-[#f7f9fb] text-sm font-semibold">
          Tipo de sociedad
        </label>
        <select
          {...register("sociedad", {
            required: "Campo Obligatorio*",
          })}
          className="mt-2 p-3 w-full text-[#f7f9fb] rounded-lg bg-[#242a37] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        >
          <option value="sas">S.A.S</option>
          <option value="sa">S.A</option>
          <option value="ltda">LTDA</option>
        </select>
        {errors.sociedad && (
          <p className="text-[#E53935] font-semibold text-sm">
            {errors.sociedad.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="" className="text-[#f7f9fb] text-sm font-semibold">
          NIT (Número de Identificación Tributaria)
        </label>
        <input
          {...register("nitPersonaJuridica",{
            required: "Campo Obligatorio*",
          })}
          className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb]  focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        />
        {errors.nitPersonaJuridica && (
           <p className="text-[#E53935] font-semibold text-sm">
            {errors.nitPersonaJuridica.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="" className="text-[#f7f9fb] text-sm font-semibold">
          Número de matrícula mercantil
        </label>
        <input
          {...register("matriculaMercantil",{
            required: "Campo Obligatorio*",
          })}
          className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb]  focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        />
        {errors.matriculaMercantil && (
          <p className="text-[#E53935] font-semibold text-sm">
            {errors.matriculaMercantil.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-[#f7f9fb] ">
          Fecha de Constitución
        </label>
        <input
          {...register("fechaDeConstitucion",{
            required: "Campo Obligatorio*",
          })}
          type="date"
          className="mt-2 text-[#f7f9fb]  p-3 w-full rounded-lg bg-[#242a37] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
        />
        {errors.fechaDeConstitucion && (
          <p className="text-[#E53935] font-semibold text-sm">
            {errors.fechaDeConstitucion.message}
          </p>
        )}
      </div>
      <div className="flex gap-4 pt-4 my-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 cursor-pointer "
        >
          Registrarse
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            clearErrors();
            setValue("personType", "");
          }}
          className="flex-1 bg-[#13171f] text-white py-2 rounded hover:bg-[#202630] font-semibold cursor-pointer"
        >
          Limpiar
        </button>
      </div>
    </div>
  );

  const renderDynamicForm = () => {
    switch (personType) {
      case "natural":
        console.log("Renderizando PersonaNaturalForm");
        return <PersonaNaturalForm />;
      case "juridica":
        return <PersonaJuridicaForm />;
      default:
        return (
          <div className="text-center text-[#f7f9fb] font-semibold">
            Selecciona una opción
          </div>
        );
    }
  };

  const handleNextTab = async () => {
    // Campos obligatorios del tab1
    const tab1Fields = [
      "firstName",
      "lastName",
      "documentType",
      "documentNumber",
      "documentIssueDate",
      "birthDate",
      "country",
      "state",
      "city",
      "address",
      "email",
      "phone",
      "password",
    ];

    const isValid = await trigger(tab1Fields);

    if (isValid) {
      handleTabChange("tab2");
    }
  };

  return (
    <div className=" min-h-screen bg-[#13171f] py-6">
      <div className="min-h-screen  overflow-hidden relative">
        {/* Círculo flotantes */}
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

        {/* Estilos CSS para la animación de flotación*/}
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

        <div className="relative flex justify-center items-center min-h-screen">
          <div className="w-[80%]">
            <div className="flex justify-center w-[100%]">
              <div className="w-[80%] rounded-lg bg-[#171d26]">
                <div>
                  {/*Parte superior del formulario*/}
                  <div className="bg-gradient-to-tr pt-10 from-[#fa7942] to-[#ff9365] flex justify-center rounded-lg">
                    <div className="block w-[100%]">
                      <h1 className="text-[#171d26] text-center text-3xl font-bold">
                        Crea tu cuenta
                      </h1>
                      <p className="mt-2 text-md text-[#202630] text-center">
                        Únete a la mejor plataforma de subastas digitales.
                      </p>
                      <div className=" flex justify-center my-4 ">
                        <div className="w-[50%]">
                          <select
                            {...register("userType", {
                              required: "Requerido",
                            })}
                            value={selectedOption}
                            onChange={(e) => {
                              setSelectedOption(e.target.value);
                              if (
                                e.target.value === "comprador" &&
                                activeTab === "tab2"
                              ) {
                                setActiveTab("tab1");
                              }
                            }}
                            className="w-full p-2 border border-[#f7f9fb]/30 rounded bg-[#f7f9fb]/20"
                          >
                            <option
                              value=""
                              className="bg-[#202630] text-[#f7f9fb]"
                            >
                              Tipo de Usuario
                            </option>
                            <option
                              value="vendedor"
                              className="bg-[#202630] text-[#f7f9fb]"
                            >
                              Vendedor
                            </option>
                            <option
                              value="comprador"
                              className="bg-[#202630] text-[#f7f9fb]"
                            >
                              Comprador
                            </option>
                          </select>
                        </div>
                      </div>
                      {/* Botones de las pestañas*/}
                      <div className="flex bg-[#242a37]">
                        <button
                          onClick={() => setActiveTab("tab1")}
                          className={`flex-1 py-3 px-4 font-medium transition-all ${
                            activeTab === "tab1"
                              ? "bg-[#171d26] text-[#ff9365] shadow-sm border-b-2 border-[#FF6F3C]"
                              : "text-[#f7f9fb] hover:text-[#ff9365] cursor-pointer"
                          }`}
                        >
                          Datos Personales
                        </button>

                        <button
                          onClick={() => handleTabChange("tab2")}
                          disabled={isTabBlocked("tab2")}
                          className={`flex-1 py-3 px-4 font-medium transition-all ${
                            isTabBlocked("tab2")
                              ? "bg-[#f7f9fb] text-gray-400 cursor-not-allowed opacity-50"
                              : activeTab === "tab2"
                              ? "bg-[#171d26] text-[#ff9365] shadow-sm border-b-2 border-[#FF6F3C]"
                              : "text-[#f7f9fb] hover:text-[#ff9365] cursor-pointer"
                          }`}
                        >
                          Información Comercial
                          {isTabBlocked("tab2") && (
                            <span className="ml-1">🔒</span>
                          )}{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center mt-2">
                    <div className="w-[100%]">
                      {registerErrors.map((error, i) => (
                        <div
                          className="bg-[#E53935] p-2 text-white mb-2 font-semibold"
                          key={i}
                        >
                          {error}
                        </div>
                      ))}
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
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="">
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Primer Nombre
                            </label>
                            <input
                              {...register("firstName", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.firstName && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Segundo Nombre
                            </label>
                            <input
                              {...register("middleName")}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Primer Apellido
                            </label>
                            <input
                              {...register("lastName", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.lastName && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.lastName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Segundo Apellido
                            </label>
                            <input
                              {...register("secondLastName")}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                          </div>
                        </div>

                        {/* Documento */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Tipo de documento
                            </label>
                            <select
                              {...register("documentType", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            >
                              <option value="cedula">
                                C.C - Cédula de ciudadanía
                              </option>
                              <option value="tarjetaExtranjeria">
                                T.E - Tarjeta de extranjería
                              </option>
                              <option value="cedulaExtranjeria">
                                C.E - Cédula de extranjería
                              </option>
                              <option value="pasaporte">P.P Pasaporte</option>
                            </select>
                            {errors.documentType && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.documentType.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Número de Documento
                            </label>
                            <input
                              {...register("documentNumber", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.documentNumber && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.documentNumber.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#f7f9fb] ">
                              Fecha Expedición
                            </label>
                            <input
                              type="date"
                              {...register("documentIssueDate", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.documentIssueDate && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.documentIssueDate.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#f7f9fb] ">
                              Fecha Nacimiento
                            </label>
                            <input
                              type="date"
                              {...register("birthDate", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.birthDate && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.birthDate.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              País
                            </label>
                            <input
                              {...register("country", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.country && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.country.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Departamento
                            </label>
                            <input
                              {...register("state", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.state && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.state.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Ciudad
                            </label>
                            <input
                              {...register("city", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.city && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor=""
                            className="text-[#f7f9fb] text-sm font-semibold"
                          >
                            Dirección
                          </label>
                          <input
                            {...register("address", {
                              required: "Campo Obligatorio*",
                            })}
                            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                          />
                          {errors.address && (
                            <p className="text-[#E53935] font-semibold text-sm">
                              {errors.address.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              {...register("email", {
                                required: "Campo Obligatorio*",
                                pattern: {
                                  value: /^\S+@\S+$/i,
                                  message: "Email inválido",
                                },
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.email && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor=""
                              className="text-[#f7f9fb] text-sm font-semibold"
                            >
                              Teléfono
                            </label>
                            <input
                              {...register("phone", {
                                required: "Campo Obligatorio*",
                              })}
                              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb]  focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                            />
                            {errors.phone && (
                              <p className="text-[#E53935] font-semibold text-sm">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                          <label
                            htmlFor=""
                            className="text-[#f7f9fb] text-sm font-semibold"
                          >
                            Contraseña
                          </label>
                          <input
                            type="password"
                            {...register("password", {
                              required: "Campo Obligatorio*",
                              minLength: {
                                value: 8,
                                message: "Mínimo 8 caracteres",
                              },
                            })}
                            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
                          />
                          {errors.password && (
                            <p className="text-[#E53935] font-semibold text-sm">
                              {errors.password.message}
                            </p>
                          )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4 my-6">
                          {selectedOption === "comprador" && (
                            <button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 cursor-pointer "
                            >
                              Registrarse
                            </button>
                          )}

                          {selectedOption === "vendedor" && (
                            <button
                              onClick={() => handleNextTab()}
                              className="flex-1 bg-[#202630] text-[#f7f9fb] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 cursor-pointer "
                            >
                              Siguiente
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              reset();
                              clearErrors();
                            }}
                            className="flex-1 bg-[#13171f] text-white py-2 rounded hover:bg-[#202630] font-semibold cursor-pointer"
                          >
                            Limpiar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {activeTab === "tab2" && (
                    <div className="flex justify-center">
                      <div className="w-[80%] my-4 flex justify-center">
                        {/* Renderizar el formulario dinámico */}
                        <div className="w-[90%] block">
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className=" block"
                          >
                            <div className="flex justify-center gap-8">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  {...register("personType", {
                                    required: "Requerido",
                                  })}
                                  type="radio"
                                  name="personType"
                                  value="natural"
                                  className="hidden"
                                />
                                <div
                                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                                    personType === "natural"
                                      ? "border-[#ff9365] bg-[#ff9365]/5 shadow-md"
                                      : "border-[#f7f9fb] hover:border-[#ff9365]"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      personType === "natural"
                                        ? "border-[#ff9365] bg-[#ff9365]"
                                        : "border-[#f7f9fb]"
                                    }`}
                                  >
                                    {personType === "natural" && (
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span
                                    className={`font-medium ${
                                      personType === "natural"
                                        ? "text-[#FF6F3C]"
                                        : "text-[#f7f9fb]"
                                    }`}
                                  >
                                    Persona Natural
                                  </span>
                                </div>
                              </label>

                              <label className="flex items-center cursor-pointer">
                                <input
                                  {...register("personType", {
                                    required: "Requerido",
                                  })}
                                  type="radio"
                                  name="personType"
                                  value="juridica"
                                  className="hidden"
                                />
                                <div
                                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                                    personType === "juridica"
                                      ? "border-[#ff9365] bg-[#FF6F3C]/10 shadow-md"
                                      : "border-[#f7f9fb] hover:border-[#ff9365]/50"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      personType === "juridica"
                                        ? "border-[#ff9365] bg-[#ff9365]"
                                        : "border-[#f7f9fb]"
                                    }`}
                                  >
                                    {personType === "juridica" && (
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span
                                    className={`font-medium ${
                                      personType === "juridica"
                                        ? "text-[#fa7942]"
                                        : "text-[#f7f9fb]"
                                    }`}
                                  >
                                    Persona Jurídica
                                  </span>
                                </div>
                              </label>
                            </div>
                            <div className="my-4">{renderDynamicForm()}</div>
                          </form>
                          {/* Radio buttons*/}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-gradient-to-tr rounded-b-lg py-8 from-[#fa7942] to-[#ff9365] flex justify-center items-center">
                    <div className="block py-2.5">
                      <h1 className="text-[#13171f] font-bold text-md">
                        ¿Ya eres parte de SubastasNaPa?
                      </h1>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={irLogin}
                          className="w-full bg-transparent border-2 border-[#13171f] px-6 py-2 rounded-lg text-[#13171f] font-semibold hover:bg-[#13171f] hover:text-[#fa7942] cursor-pointer"
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
    </div>
  );
}

export default RegisterPage;

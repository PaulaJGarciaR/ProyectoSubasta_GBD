import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ProductFormPage({ productToEdit, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { createProduct, getProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  const params = useParams();

  // Función para formatear fecha a string YYYY-MM-DD para el input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    async function loadProduct() {
      // ✅ Prioridad 1: Si viene productToEdit del modal
      if (productToEdit) {
        console.log("Cargando desde modal:", productToEdit);
        setValue("title", productToEdit.title);
        setValue("description", productToEdit.description);
        setValue("image", productToEdit.image);
        setValue("startingPrice", productToEdit.startingPrice);
        setValue("dateStart", formatDateForInput(productToEdit.dateStart));
        setValue("dateEnd", formatDateForInput(productToEdit.dateEnd));
      }
      // ✅ Prioridad 2: Si viene params.id de la URL
      else if (params.id) {
        const product = await getProduct(params.id);
        console.log("Cargando desde URL:", product);
        setValue("title", product.title);
        setValue("description", product.description);
        setValue("image", product.image);
        setValue("startingPrice", product.startingPrice);
        setValue("dateStart", product.dateStart);
        setValue("dateEnd", product.dateEnd);
      }
    }
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit, params.id]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // ✅ Transformar las fechas antes de enviar
       const formattedData = {
      ...data,
      dateStart: (() => {
        // Añadir 'T00:00:00' para forzar interpretación local
        const date = new Date(data.dateStart + 'T00:00:00');
        return date;
      })(),
      dateEnd: (() => {
        // Añadir 'T23:59:59' para forzar interpretación local
        const date = new Date(data.dateEnd + 'T23:59:59');
        return date;
      })(),
    };

      // ✅ Si viene productToEdit, actualizar ese producto
      if (productToEdit) {
        await updateProduct(productToEdit._id, formattedData);

        Swal.fire({
          title: "¡Actualizado!",
          text: "La subasta ha sido actualizada exitosamente",
          icon: "success",
          confirmButtonColor: "#fa7942",
          background: "#171d26",
          color: "#f7f9fb",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onClose) {
          onClose(); // Cerrar modal
        }
      }
      // ✅ Si viene params.id, actualizar desde URL
      else if (params.id) {
        await updateProduct(params.id, formattedData);

        Swal.fire({
          title: "¡Actualizado!",
          text: "La subasta ha sido actualizada exitosamente",
          icon: "success",
          confirmButtonColor: "#fa7942",
          background: "#171d26",
          color: "#f7f9fb",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/dashboardvendedor");
      }
      // ✅ Si no, crear nuevo producto
      else {
        await createProduct(formattedData);

        Swal.fire({
          title: "¡Creado!",
          text: "La subasta ha sido creada exitosamente",
          icon: "success",
          confirmButtonColor: "#fa7942",
          background: "#171d26",
          color: "#f7f9fb",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onClose) {
          onClose(); // Cerrar modal si existe
        } else {
          navigate("/dashboardvendedor");
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);

      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la subasta. Por favor intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#fa7942",
        background: "#171d26",
        color: "#f7f9fb",
      });
    }
  });

  // ✅ Si se usa en modal, no mostrar el wrapper completo
  const isModal = !!productToEdit || !!onClose;

  if (isModal) {
    return (
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">Título</label>
          <input
            {...register("title", { required: "El título es requerido" })}
            type="text"
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.title && (
            <span className="text-red-400 text-xs mt-1">
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">
            Descripción
          </label>
          <textarea
            {...register("description", {
              required: "La descripción es requerida",
            })}
            rows="4"
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.description && (
            <span className="text-red-400 text-xs mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">
            Imagen (URL)
          </label>
          <input
            type="url"
            {...register("image", { required: "La imagen es requerida" })}
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.image && (
            <span className="text-red-400 text-xs mt-1">
              {errors.image.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">
            Precio Inicial
          </label>
          <input
            type="number"
            {...register("startingPrice", {
              required: "El precio es requerido",
              valueAsNumber: true,
              min: { value: 0.01, message: "El precio debe ser mayor a 0" },
            })}
            step="0.01"
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.startingPrice && (
            <span className="text-red-400 text-xs mt-1">
              {errors.startingPrice.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">
            Fecha de Inicio
          </label>
          <input
            type="date"
            {...register("dateStart", {
              required: "La fecha de inicio es requerida",
            })}
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.dateStart && (
            <span className="text-red-400 text-xs mt-1">
              {errors.dateStart.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-[#D6DEE3] font-semibold">
            Fecha de Fin
          </label>
          <input
            type="date"
            {...register("dateEnd", {
              required: "La fecha de fin es requerida",
            })}
            className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
          />
          {errors.dateEnd && (
            <span className="text-red-400 text-xs mt-1">
              {errors.dateEnd.message}
            </span>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {productToEdit ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    );
  }

  // ✅ Vista completa para cuando se usa como página independiente
  return (
    <div className="bg-[#13171f] min-h-screen">
      <div className="bg-[#13171f] min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-[#171d26] rounded-lg p-8">
          <h1 className="text-[#f7f9fb] font-bold text-2xl text-center mb-8">
            Información de Productos
          </h1>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Título
              </label>
              <input
                {...register("title", { required: "El título es requerido" })}
                type="text"
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.title && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Descripción
              </label>
              <textarea
                {...register("description", {
                  required: "La descripción es requerida",
                })}
                rows="4"
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.description && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Imagen (URL)
              </label>
              <input
                type="url"
                {...register("image", { required: "La imagen es requerida" })}
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.image && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.image.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Precio Inicial
              </label>
              <input
                type="number"
                {...register("startingPrice", {
                  required: "El precio es requerido",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "El precio debe ser mayor a 0" },
                })}
                step="0.01"
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.startingPrice && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.startingPrice.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Fecha de Inicio
              </label>
              <input
                type="date"
                {...register("dateStart", {
                  required: "La fecha de inicio es requerida",
                })}
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.dateStart && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.dateStart.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-[#D6DEE3] font-semibold">
                Fecha de Fin
              </label>
              <input
                type="date"
                {...register("dateEnd", {
                  required: "La fecha de fin es requerida",
                })}
                className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              />
              {errors.dateEnd && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.dateEnd.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 transition-transform mt-6"
            >
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductFormPage;
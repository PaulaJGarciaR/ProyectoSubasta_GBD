import React, { useEffect } from 'react'
import { useForm} from 'react-hook-form'
import { useProducts } from '../context/ProductContext';
import {  useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ProductFormPage() {
    const {register,handleSubmit,setValue}=useForm();
    const {createProduct,getProduct,updateProduct}=useProducts();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
      async function loadProduct() {
        if(params.id){
          const product = await getProduct(params.id)
          console.log(product)
          setValue('title',product.title)
          setValue('description',product.description)
          setValue('image',product.image)
          setValue(' startingPrice',product.startingPrice)
          setValue('dateStart',product.dateStart)
          setValue('dateEnd',product.dateEnd)
        }
        
      }
     loadProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const onSubmit= handleSubmit((data) => {
      if (params.id){
        updateProduct(params.id,data);
      } else{
        createProduct(data);
      }
      navigate("/dashboardvendedor")
        
    })


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
             {...register("title")}
              type="text"
              name="title"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <div>
            <label className="text-sm text-[#D6DEE3] font-semibold">
              Descripción
            </label>
            <textarea
              {...register("description")}
              name="description"
              rows="4"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <div>
            <label className="text-sm text-[#D6DEE3] font-semibold">
              Imagen (URL)
            </label>
            <input
              type="url"
              {...register("image")}
              name="image"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <div>
            <label className="text-sm text-[#D6DEE3] font-semibold">
              Precio Inicial
            </label>
            <input
              type="number"
              {...register("startingPrice", { valueAsNumber: true })}
              name="startingPrice"
              step="0.01"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <div>
            <label className="text-sm text-[#D6DEE3] font-semibold">
              Fecha de Inicio
            </label>
            <input
              type="date"
              {...register("dateStart")}
              name="dateStart"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <div>
            <label className="text-sm text-[#D6DEE3] font-semibold">
              Fecha de Fin
            </label>
            <input
              type="date"
              {...register("dateEnd")}
              name="dateEnd"
              className="mt-2 p-3 w-full rounded-lg bg-[#242a37] text-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            />
          </div>

          <button 
            type="submit"
            className="bg-gradient-to-r from-[#fa7942] to-[#ff9365] text-[#171d26] px-6 py-3 rounded-lg font-semibold w-full hover:scale-105 transition-transform mt-6">
            Guardar
          </button>
        </form>
      </div>
    </div>
      
    </div>
  )
}

export default ProductFormPage
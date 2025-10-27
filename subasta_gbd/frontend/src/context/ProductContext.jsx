import { createContext, useContext, useState } from "react";
import {
  createProductRequest,
  getProductsRequest,
  getMyProductsRequest,
  deleteProductRequest,
  getProductRequest,
  updateProductRequest
} from "../api/products";
import React from "react";

const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  // Para compradores (todos los productos)
const getProducts = async () => {
  try {
    const res = await getProductsRequest();
    setProducts(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Para vendedores (solo mis productos)  ← AGREGAR ESTA FUNCIÓN
const getMyProducts = async () => {
  try {
    const res = await getMyProductsRequest();
    setProducts(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  const createProduct = async (product) => {
    const res = await createProductRequest(product);
    console.log(res);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await deleteProductRequest(id);
      if (res.status == 204)
        setProducts(products.filter((product) => product._id != id));
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await getProductRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };



  const updateProduct = async(id,product) => {
    try {
      await updateProductRequest(id,product);
    } catch (error) {
      console.error(error)
      
    }
  }




  return (
    <ProductContext.Provider
      value={{
        products,
        createProduct,
        getProducts,
         getMyProducts,
        deleteProduct,
        getProduct,
        updateProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

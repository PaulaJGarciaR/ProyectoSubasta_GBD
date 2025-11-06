import axios from "./axios";

export const getProductsRequest = () => axios.get("/products");
export const getMyProductsRequest = () => axios.get("/products/my-products");

export const getProductRequest = (id) => axios.get(`/products/${id}`);

export const createProductRequest = (product) => axios.post("/products", product);

export const updateProductRequest = (id,product) =>
  axios.put(`/products/${id}`, product);

export const deleteProductRequest = (id) => axios.delete(`/products/${id}`);


// Búsqueda avanzada con todos los filtros
export const searchProductsRequest = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined && value !== false) {
      params.append(key, value);
    }
  });
  
  return axios.get(`/products/search?${params.toString()}`);
};

// Búsqueda por características específicas
export const searchByFeaturesRequest = (features) => {
  return axios.get(`/products/search-features?features=${features}`);
};

// Subastas que terminan pronto
export const getEndingSoonRequest = (hours = 24) => {
  return axios.get(`/products/ending-soon?hours=${hours}`);
};


// Gangas
export const getBargainsRequest = () => {
  return axios.get('/products/bargains');
};

// Productos similares
export const getSimilarProductsRequest = (productId) => {
  return axios.get(`/products/${productId}/similar`);
};

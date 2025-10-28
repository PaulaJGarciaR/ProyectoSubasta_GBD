import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import DashboardVendedor from "./layouts/DashboardVendedor"
import DashboardComprador from "./layouts/DashboardComprador"
import ProductFormPage from "./pages/ProductFormPage";
import { ProductProvider } from "./context/ProductContext";
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <SocketProvider>
           <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route element={<ProtectedRoute/>}>
           <Route path="/add-product" element={<ProductFormPage />}></Route>
           <Route path="/dashboardvendedor/:id" element={<ProductFormPage />}></Route>
            <Route path="/dashboardvendedor" element={<DashboardVendedor />}></Route>
            <Route path="/dashboardcomprador" element={<DashboardComprador />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
        </SocketProvider>
       
      </ProductProvider>
      
    </AuthProvider>
  );
}

export default App;

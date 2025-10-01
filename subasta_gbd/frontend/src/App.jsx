import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardVendedor from "./layouts/DashboardVendedor"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboardvendedor" element={<DashboardVendedor />}></Route>
            <Route path="/dashboard" element={<DashboardPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors,setErrors] = useState([])
  const [loading,setloading] = useState(true);

   useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errors]);

  
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response)
      setErrors(error.response.data)
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setIsAuthenticated(true);
      setUser(res.data);
      setErrors([])
    } catch (error) {
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)
      }
      setErrors([error.response.data.message])
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null)
  }

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setloading(false);
        return setUser(null);
      }

        try {
          const res = await verifyTokenRequest(cookies.token);
          console.log(res);
          if (!res.data){
            setIsAuthenticated(false);
            setloading(false);
            return;
          }
 
          setIsAuthenticated(true);
          setUser(res.data);
          setloading(false);
        } catch (error) {
          console.log(error)
          setIsAuthenticated(false);
          setUser(null);
          setloading(false);
        }
      
    }

    checkLogin();
  }, []);

  const clearErrors = () => {
  setErrors([]); 
};


  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

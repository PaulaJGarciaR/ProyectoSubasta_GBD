import { useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

axios.defaults.withCredentials = true;

export const useAnalytics = (user) => {
  const sessionIdRef = useRef(null);
  const sessionStartRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false); 

  const limpiarCookies = useCallback((resetearFlag = true) => {
    console.log('Limpiando cookies de analytics...');
    Cookies.remove('analytics_session_id');
    Cookies.remove('analytics_user_id');
    Cookies.remove('session_start_time');
    Cookies.remove('current_category');
    Cookies.remove('category_start_time');
    Cookies.remove('bid_attempts');
    Cookies.remove('session_duration');
    Cookies.remove('last_activity');
    
    sessionIdRef.current = null;
    sessionStartRef.current = null;
    
    if (resetearFlag) {
      hasInitializedRef.current = false;
    }
  }, []);

  const validarSesionBackend = useCallback(async (sessionId, userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/analytics/session/validate`,
        { sessionId },
        { withCredentials: true }
      );
      
      return response.data.valida === true;
    } catch (error) {
      console.log('Sesión no válida en backend');
      return false;
    }
  }, []);

  const initSession = useCallback(async () => {
    if (!user) {
      console.log('No hay usuario, no se inicia analytics');
      return;
    }

    if (sessionIdRef.current && hasInitializedRef.current) {
      console.log('Ya hay una sesión inicializada:', sessionIdRef.current);
      return;
    }

    if (isInitializingRef.current) {
      console.log('Ya hay una inicialización en progreso...');
      return;
    }

    isInitializingRef.current = true;

    try {
      const userId = user._id || user.id;
      let sessionId = Cookies.get('analytics_session_id');
      const cookieUserId = Cookies.get('analytics_user_id');
      
      console.log('Verificando sesión existente:', { sessionId, cookieUserId, userId });
      
      if (sessionId && cookieUserId && cookieUserId !== userId) {
        console.log('Sesión de otro usuario detectada, cerrando...');
        
        await axios.post(
          `${API_URL}/analytics/session/close`,
          { sessionId },
          { withCredentials: true }
        ).catch(err => console.log('Error cerrando sesión anterior:', err.message));
        
        limpiarCookies();
        sessionId = null;
      }
    
      if (sessionId) {
        console.log('📋 Validando sesión en backend:', sessionId);
        
        const esValida = await validarSesionBackend(sessionId, userId);
        
        if (!esValida) {
          console.log('Sesión NO válida en backend, limpiando y recreando...');
          limpiarCookies();
          sessionId = null;
        } else {
          console.log('Sesión válida en backend');
        }
      }
      
      if (!sessionId) {
        console.log('Creando nueva sesión de analytics...');
        
        const response = await axios.post(
          `${API_URL}/analytics/session/create`,
          {},
          { withCredentials: true }
        );

        sessionId = response.data.sessionId;
        
        Cookies.set('analytics_session_id', sessionId, { expires: 1 });
        Cookies.set('analytics_user_id', userId, { expires: 1 });
        Cookies.set('session_start_time', Date.now().toString(), { expires: 1 });
        
        console.log('Nueva sesión creada:', sessionId);
      } else {
        console.log('Sesión existente recuperada:', sessionId);
      }

      sessionIdRef.current = sessionId;
      sessionStartRef.current = parseInt(Cookies.get('session_start_time')) || Date.now();
      hasInitializedRef.current = true; 
      
    } catch (error) {
      console.error('Error iniciando sesión de analytics:', error);
      
      if (error.response?.status === 401) {
        console.log('No hay token de autenticación válido');
      }
      
      // Si hay error crítico, limpiar cookies para reintentar
      limpiarCookies();
      
    } finally {
      isInitializingRef.current = false;
    }
  }, [user, limpiarCookies, validarSesionBackend]);

  // Registrar clic en categoría (VERSIÓN HÍBRIDA)
  const trackCategoryClick = useCallback(async (categoria) => {
    // Intentar recuperar sessionId de ref o cookies
    let sessionId = sessionIdRef.current || Cookies.get('analytics_session_id');
    
    console.log('🔍 Registrando categoría:', {
      categoria,
      sessionIdFromRef: sessionIdRef.current,
      sessionIdFromCookie: Cookies.get('analytics_session_id'),
      sessionIdUsing: sessionId
    });

    // Si no hay sesión en ningún lado, salir
    if (!sessionId) {
      console.warn('No hay sesión activa. Categoría no registrada:', categoria);
      return;
    }

    // Si tenemos sessionId en cookie pero no en ref, restaurar el ref
    if (sessionId && !sessionIdRef.current) {
      console.log(' Restaurando sessionId en ref desde cookie');
      sessionIdRef.current = sessionId;
      sessionStartRef.current = parseInt(Cookies.get('session_start_time')) || Date.now();
      hasInitializedRef.current = true;
    }

    try {
      await axios.post(
        `${API_URL}/analytics/category/click`,
        {
          sessionId: sessionId,
          categoria
        },
        { withCredentials: true }
      );

      console.log('Categoría registrada exitosamente:', categoria);
      
    } catch (error) {
      console.error('Error registrando categoría:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      // Si la sesión no existe en backend, limpiar todo
      if (error.response?.status === 404) {
        console.warn('Sesión no encontrada en backend. Limpiando cookies...');
        limpiarCookies(false);
      }
    }
  }, [limpiarCookies]);

  // Registrar intento de puja (VERSIÓN HÍBRIDA)
  const trackBidAttempt = useCallback(async (productoId, montoIntentado, exitoso, razonFallo = null) => {
    // Intentar recuperar sessionId de ref o cookies
    let sessionId = sessionIdRef.current || Cookies.get('analytics_session_id');

    if (!sessionId) {
      console.warn('No hay sesión para registrar puja');
      return;
    }

    // Restaurar ref si es necesario
    if (sessionId && !sessionIdRef.current) {
      sessionIdRef.current = sessionId;
      sessionStartRef.current = parseInt(Cookies.get('session_start_time')) || Date.now();
      hasInitializedRef.current = true;
    }

    try {
      await axios.post(
        `${API_URL}/analytics/bid/attempt`,
        {
          sessionId: sessionId,
          productoId,
          montoIntentado,
          exitoso,
          razonFallo
        },
        { withCredentials: true }
      );

      const intentos = parseInt(Cookies.get('bid_attempts') || '0') + 1;
      Cookies.set('bid_attempts', intentos.toString());
      
      console.log(`Intento de puja registrado: ${exitoso ? 'Exitoso' : 'Fallido'}`);
      
    } catch (error) {
      console.error('Error registrando intento de puja:', error);
      
      if (error.response?.status === 404) {
        console.warn('Sesión expirada. Limpiando cookies...');
        limpiarCookies(false);
      }
    }
  }, [limpiarCookies]);

  // Actualizar tiempo de sesión periódicamente 
  const updateSessionTime = useCallback(async () => {
    let sessionId = sessionIdRef.current || Cookies.get('analytics_session_id');
    let sessionStart = sessionStartRef.current || parseInt(Cookies.get('session_start_time'));

    if (!sessionId || !sessionStart) return;

    // Restaurar refs si es necesario
    if (sessionId && !sessionIdRef.current) {
      sessionIdRef.current = sessionId;
      sessionStartRef.current = sessionStart;
      hasInitializedRef.current = true;
    }

    const duracionSegundos = Math.floor((Date.now() - sessionStart) / 1000);

    try {
      await axios.put(
        `${API_URL}/analytics/session/time`,
        {
          sessionId: sessionId,
          duracionSegundos
        },
        { withCredentials: true }
      );

      Cookies.set('session_duration', duracionSegundos.toString());
      
    } catch (error) {
      console.error('Error actualizando tiempo de sesión:', error);
      
      if (error.response?.status === 404) {
        console.warn('Sesión expirada. Limpiando cookies...');
        limpiarCookies(false);
      }
    }
  }, [limpiarCookies]);

  const closeSession = useCallback(async () => {
    if (!sessionIdRef.current) {
      console.log('No hay sesión activa para cerrar');
      return;
    }

    try {
      console.log('Cerrando sesión de analytics:', sessionIdRef.current);
      
      await axios.post(
        `${API_URL}/analytics/session/close`,
        {
          sessionId: sessionIdRef.current
        },
        { withCredentials: true }
      );

      console.log('Sesión de analytics cerrada correctamente');
      
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    } finally {
      limpiarCookies(false);
    }
  }, [limpiarCookies]);

  // Detectar inactividad
  const trackActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    Cookies.set('last_activity', Date.now().toString());
  }, []);

  // Obtener información de la sesión actual
  const getSessionInfo = useCallback(() => {
    return {
      sessionId: Cookies.get('analytics_session_id'),
      userId: Cookies.get('analytics_user_id'),
      startTime: parseInt(Cookies.get('session_start_time') || '0'),
      currentCategory: Cookies.get('current_category'),
      bidAttempts: parseInt(Cookies.get('bid_attempts') || '0'),
      duration: parseInt(Cookies.get('session_duration') || '0'),
      lastActivity: parseInt(Cookies.get('last_activity') || '0')
    };
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('No hay usuario, no se inicia analytics');
      return;
    }

    const userId = user._id || user.id;
    if (!userId) {
      console.log('Usuario sin ID válido');
      return;
    }

    console.log('👤 Usuario detectado:', user.email || userId);
    
    if (!hasInitializedRef.current) {
      initSession();
    }

    // Actualizar tiempo cada 30 segundos
    const timeInterval = setInterval(() => {
      updateSessionTime();
    }, 30000);

    // Detectar actividad
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, trackActivity);
    });

    // Cerrar sesión al salir
    const handleBeforeUnload = () => {
      closeSession();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timeInterval);
      events.forEach(event => {
        window.removeEventListener(event, trackActivity);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]); 

  return {
    trackCategoryClick,
    trackBidAttempt,
    closeSession,
    getSessionInfo,
    resetAnalytics: () => limpiarCookies(true)
  };
};
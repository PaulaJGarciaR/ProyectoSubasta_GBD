import { useState, useEffect } from 'react';
import {
  FileText,
  AlertCircle,
  Package,
  Shield,
  Send,
  X,
  CheckCircle,
  User,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { createPQRSRequest } from '../api/pqrs';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const SWAL_CONFIG = {
  confirmButtonColor: '#fa7942',
  background: '#171d26',
  color: '#f7f9fb'
};

export default function PQRSForm({ onClose, onSuccess, preselectedProduct, preselectedUser }) {
  const { products } = useProducts();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usersInvolved, setUsersInvolved] = useState([]);
  
  const [formData, setFormData] = useState({
    toUserId: preselectedUser || '',
    type: '',
    category: '',
    subject: '',
    description: '',
    productId: preselectedProduct || '',
    priority: 'Media',
    isAnonymous: false
  });

  const pqrsTypes = [
    { value: 'Petición', icon: FileText, color: 'blue', description: 'Solicitar algo específico' },
    { value: 'Queja', icon: AlertCircle, color: 'orange', description: 'Expresar insatisfacción' },
    { value: 'Reclamo', icon: AlertCircle, color: 'red', description: 'Exigir solución a un problema' },
    { value: 'Solicitud', icon: FileText, color: 'green', description: 'Pedir información o acción' }
  ];

  const categories = [
    'Pago no recibido',
    'Producto no entregado',
    'Producto defectuoso',
    'Descripción engañosa',
    'Comunicación deficiente',
    'Incumplimiento de términos',
    'Reembolso',
    'Sugerencia',
    'Otro'
  ];

  const priorities = [
    { value: 'Baja', color: 'gray' },
    { value: 'Media', color: 'blue' },
    { value: 'Alta', color: 'orange' },
    { value: 'Urgente', color: 'red' }
  ];

  const anonymityLevels = []; // Ya no se usa

  // Obtener usuarios involucrados cuando se selecciona un producto
  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p._id === formData.productId);
      if (product) {
        const users = [];
        
        // Agregar vendedor
        if (product.user && product.user._id !== user?.id) {
          users.push({
            id: product.user._id,
            name: product.user.name || product.user.email,
            email: product.user.email,
            role: 'Vendedor'
          });
        }
        
        // Agregar ganador/comprador si existe
        if (product.winner && product.winner._id !== user?.id) {
          users.push({
            id: product.winner._id,
            name: product.winner.name || product.winner.email,
            email: product.winner.email,
            role: 'Comprador'
          });
        }
        
        setUsersInvolved(users);
        
        // Si solo hay un usuario, seleccionarlo automáticamente
        if (users.length === 1 && !formData.toUserId) {
          setFormData(prev => ({ ...prev, toUserId: users[0].id }));
        }
      }
    } else {
      setUsersInvolved([]);
      if (!preselectedUser) {
        setFormData(prev => ({ ...prev, toUserId: '' }));
      }
    }
  }, [formData.productId, products, user, preselectedUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.productId) errors.push('Debes seleccionar un producto');
    if (!formData.toUserId) errors.push('Debes seleccionar un destinatario');
    if (!formData.type) errors.push('Debes seleccionar un tipo de PQRS');
    if (!formData.category) errors.push('Debes seleccionar una categoría');
    if (!formData.subject.trim()) errors.push('Debes escribir un asunto');
    if (!formData.description.trim()) errors.push('Debes escribir una descripción');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    
    if (errors.length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: `
          <div class="text-left">
            <p class="mb-2">Por favor completa los siguientes campos:</p>
            <ul class="list-disc list-inside text-sm">
              ${errors.map(err => `<li>${err}</li>`).join('')}
            </ul>
          </div>
        `,
        icon: 'warning',
        ...SWAL_CONFIG
      });
      return;
    }

    try {
      setLoading(true);

      const response = await createPQRSRequest(formData);

      await Swal.fire({
        title: '¡PQRS Creada Exitosamente!',
        html: `
          <div class="space-y-3">
            <p class="text-gray-400">Tu ${formData.type.toLowerCase()} ha sido registrada</p>
            <div class="bg-[#13171f] p-3 rounded-lg border border-[#fa7942]/30">
              <p class="text-[#fa7942] font-bold text-lg">${response.data.pqrs.ticketNumber}</p>
              <p class="text-xs text-gray-400 mt-1">Número de ticket</p>
            </div>
            ${formData.isAnonymous ? `
              <div class="flex items-center justify-center gap-2 text-yellow-400 text-sm">
                <span>🔒</span>
                <span>Enviada de forma completamente anónima</span>
              </div>
            ` : ''}
            <p class="text-sm text-gray-500">
              Recibirás notificaciones sobre el estado de tu PQRS
            </p>
          </div>
        `,
        icon: 'success',
        ...SWAL_CONFIG
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al crear PQRS:', error);
      Swal.fire({
        title: 'Error al crear PQRS',
        text: error.response?.data?.message || 'No se pudo crear la PQRS. Intenta nuevamente.',
        icon: 'error',
        ...SWAL_CONFIG
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = usersInvolved.find(u => u.id === formData.toUserId);

  return (
    <div className="bg-[#171d26] rounded-xl p-6 w-full max-w-[900px] mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Nueva PQRS</h2>
          <p className="text-sm text-gray-400 mt-1">
            Registra tu petición, queja, reclamo o solicitud
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Producto relacionado */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Package className="w-4 h-4 inline mr-1 text-[#fa7942]" />
            Producto relacionado <span className="text-red-400">*</span>
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            required
          >
            <option value="">Selecciona el producto involucrado</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.title || product.nombre}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona el producto sobre el cual es la PQRS
          </p>
        </div>

        {/* Usuario destinatario */}
        {formData.productId && usersInvolved.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <User className="w-4 h-4 inline mr-1 text-[#fa7942]" />
              Destinatario <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {usersInvolved.map((involvedUser) => (
                <label
                  key={involvedUser.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.toUserId === involvedUser.id
                      ? 'border-[#fa7942] bg-[#fa7942]/10'
                      : 'border-gray-700 hover:border-gray-600 bg-[#13171f]'
                  }`}
                >
                  <input
                    type="radio"
                    name="toUserId"
                    value={involvedUser.id}
                    checked={formData.toUserId === involvedUser.id}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#fa7942] focus:ring-[#fa7942]"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{involvedUser.name}</p>
                    <p className="text-sm text-gray-400">{involvedUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#fa7942]/20 text-[#fa7942] text-xs rounded">
                      {involvedUser.role}
                    </span>
                  </div>
                  {formData.toUserId === involvedUser.id && (
                    <CheckCircle className="w-6 h-6 text-[#fa7942]" />
                  )}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selecciona contra quién vas a dirigir esta PQRS
            </p>
          </div>
        )}

        {formData.productId && usersInvolved.length === 0 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium text-sm">No hay otros usuarios</p>
              <p className="text-yellow-400/80 text-xs mt-1">
                No hay otros usuarios involucrados en este producto para crear una PQRS.
              </p>
            </div>
          </div>
        )}

        {/* Tipo de PQRS */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tipo de PQRS <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pqrsTypes.map(({ value, icon: Icon, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  formData.type === value
                    ? 'border-[#fa7942] bg-[#fa7942]/10'
                    : 'border-gray-700 hover:border-gray-600 bg-[#13171f]'
                }`}
                title={description}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  formData.type === value ? 'text-[#fa7942]' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.type === value ? 'text-white' : 'text-gray-300'
                }`}>
                  {value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categoría y Prioridad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prioridad
            </label>
            <div className="flex gap-2">
              {priorities.map(({ value, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: value }))}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.priority === value
                      ? 'border-[#fa7942] bg-[#fa7942]/10 text-[#fa7942]'
                      : 'border-gray-700 bg-[#13171f] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Asunto <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Resume tu PQRS en una línea clara y concisa"
            maxLength={200}
            className="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942]"
            required
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              Sé específico sobre el problema
            </span>
            <span className="text-xs text-gray-500">
              {formData.subject.length}/200
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción detallada <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu situación con el mayor detalle posible. Incluye fechas, montos, comunicaciones previas y cualquier información relevante..."
            rows={5}
            maxLength={2000}
            className="w-full px-4 py-3 bg-[#13171f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa7942] resize-none"
            required
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              Mientras más detallada, mejor será la resolución
            </span>
            <span className="text-xs text-gray-500">
              {formData.description.length}/2000
            </span>
          </div>
        </div>

        {/* Anonimato completo - SIMPLIFICADO */}
        <div className="bg-[#13171f] border border-gray-700 rounded-lg p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAnonymous"
              id="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-gray-600 text-[#fa7942] focus:ring-[#fa7942] focus:ring-offset-0 bg-[#171d26]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-white font-medium mb-2">
                <Shield className="w-5 h-5 text-[#fa7942]" />
                Enviar de forma anónima
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Tu identidad será completamente protegida. Nadie (ni el destinatario, ni los administradores) 
                podrá saber quién envió esta PQRS.
              </p>
              
              {formData.isAnonymous && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-200 font-medium">Anonimato Total</p>
                    <p className="text-xs text-yellow-200/80 mt-1">
                      Esta PQRS aparecerá como "Usuario Anónimo" para todos. Solo tú sabrás que la enviaste 
                      cuando la veas en tu lista de PQRS enviadas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading || usersInvolved.length === 0}
            className="flex-1 py-3 bg-[#fa7942] hover:bg-[#ff9365] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar PQRS
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useForm } from 'react-hook-form';
import { registerRequest } from '../api/auth';

function RegisterPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(async(data) => {
    console.log('Datos:', data);
    const res= await registerRequest(data);
    console.log(res);
    // Aquí enviarías los datos a tu API
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registro</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Nombres */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primer Nombre *</label>
            <input 
              {...register('firstName', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Segundo Nombre</label>
            <input {...register('middleName')} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primer Apellido *</label>
            <input 
              {...register('lastName', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Segundo Apellido</label>
            <input {...register('secondLastName')} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Documento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo Documento *</label>
            <select 
              {...register('documentType', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar</option>
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
            {errors.documentType && <p className="text-red-500 text-sm">{errors.documentType.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Número Documento *</label>
            <input 
              {...register('documentNumber', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.documentNumber && <p className="text-red-500 text-sm">{errors.documentNumber.message}</p>}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Expedición *</label>
            <input 
              type="date"
              {...register('documentIssueDate', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.documentIssueDate && <p className="text-red-500 text-sm">{errors.documentIssueDate.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Nacimiento *</label>
            <input 
              type="date"
              {...register('birthDate', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">País *</label>
            <input 
              {...register('country', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estado *</label>
            <input 
              {...register('state', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad *</label>
            <input 
              {...register('city', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium mb-1">Dirección *</label>
          <input 
            {...register('address', { required: 'Requerido' })}
            className="w-full p-2 border rounded"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email"
              {...register('email', { 
                required: 'Requerido',
                pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
              })}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono *</label>
            <input 
              {...register('phone', { required: 'Requerido' })}
              className="w-full p-2 border rounded"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña *</label>
          <input 
            type="password"
            {...register('password', { 
              required: 'Requerido',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' }
            })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Registrarse
          </button>
          
          <button 
            type="button"
            onClick={() => reset()}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
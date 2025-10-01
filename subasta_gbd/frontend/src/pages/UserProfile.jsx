import React, { useState, useEffect } from 'react';
import { User, FileText, MapPin, Phone, Mail, Calendar, Edit2, Save, X, Loader, Building } from 'lucide-react';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    documentType: '',
    documentNumber: '',
    documentIssueDate: '',
    country: '',
    state: '',
    city: '',
    address: '',
    email: '',
    phone: '',
    birthDate: '',
    personType: '',
    nitPersonaNatural: '',
    razonSocial: '',
    sociedad: '',
    nitPersonaJuridica: '',
    matriculaMercantil: '',
    fechaDeConstitucion: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:4000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
         credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          userType: data.userType || '',
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          lastName: data.lastName || '',
          secondLastName: data.secondLastName || '',
          documentType: data.documentType || '',
          documentNumber: data.documentNumber || '',
          documentIssueDate: data.documentIssueDate ? data.documentIssueDate.split('T')[0] : '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          address: data.address || '',
          email: data.email || '',
          phone: data.phone || '',
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          personType: data.personType || '',
          nitPersonaNatural: data.nitPersonaNatural || '',
          razonSocial: data.razonSocial || '',
          sociedad: data.sociedad || '',
          nitPersonaJuridica: data.nitPersonaJuridica || '',
          matriculaMercantil: data.matriculaMercantil || '',
          fechaDeConstitucion: data.fechaDeConstitucion ? data.fechaDeConstitucion.split('T')[0] : ''
        });
      } else if (response.status === 404) {
        setError('Perfil no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        setSuccess('Perfil actualizado correctamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar el perfil');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({
        userType: profile.userType || '',
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        lastName: profile.lastName || '',
        secondLastName: profile.secondLastName || '',
        documentType: profile.documentType || '',
        documentNumber: profile.documentNumber || '',
        documentIssueDate: profile.documentIssueDate ? profile.documentIssueDate.split('T')[0] : '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        address: profile.address || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
        personType: profile.personType || '',
        nitPersonaNatural: profile.nitPersonaNatural || '',
        razonSocial: profile.razonSocial || '',
        sociedad: profile.sociedad || '',
        nitPersonaJuridica: profile.nitPersonaJuridica || '',
        matriculaMercantil: profile.matriculaMercantil || '',
        fechaDeConstitucion: profile.fechaDeConstitucion ? profile.fechaDeConstitucion.split('T')[0] : ''
      });
      setIsEditing(false);
      setError('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPersonaNatural = formData.personType === 'natural';
  const isPersonaJuridica = formData.personType === 'juridica';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {isEditing ? (
            <div className="space-y-6">
              {/* Tipo de Usuario y Persona */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Usuario
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="cliente">Cliente</option>
                    <option value="proveedor">Proveedor</option>
                    <option value="empleado">Empleado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Persona
                  </label>
                  <select
                    name="personType"
                    value={formData.personType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="natural">Persona Natural</option>
                    <option value="juridica">Persona Jurídica</option>
                  </select>
                </div>
              </div>

              {/* Información Personal */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primer Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Segundo Nombre
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primer Apellido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Segundo Apellido
                    </label>
                    <input
                      type="text"
                      name="secondLastName"
                      value={formData.secondLastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Documento de Identidad */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documento de Identidad
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento *
                    </label>
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="PA">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Expedición *
                    </label>
                    <input
                      type="date"
                      name="documentIssueDate"
                      value={formData.documentIssueDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ubicación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento/Estado *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Persona Natural */}
              {isPersonaNatural && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Información Persona Natural
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIT Persona Natural
                    </label>
                    <input
                      type="text"
                      name="nitPersonaNatural"
                      value={formData.nitPersonaNatural}
                      onChange={handleInputChange}
                      minLength={9}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Persona Jurídica */}
              {isPersonaJuridica && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Información Persona Jurídica
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Razón Social
                      </label>
                      <input
                        type="text"
                        name="razonSocial"
                        value={formData.razonSocial}
                        onChange={handleInputChange}
                        minLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Sociedad
                      </label>
                      <select
                        name="sociedad"
                        value={formData.sociedad}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="SAS">SAS - Sociedad por Acciones Simplificada</option>
                        <option value="SA">SA - Sociedad Anónima</option>
                        <option value="LTDA">LTDA - Sociedad Limitada</option>
                        <option value="SC">Sociedad Colectiva</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIT Persona Jurídica
                      </label>
                      <input
                        type="text"
                        name="nitPersonaJuridica"
                        value={formData.nitPersonaJuridica}
                        onChange={handleInputChange}
                        minLength={9}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matrícula Mercantil
                      </label>
                      <input
                        type="text"
                        name="matriculaMercantil"
                        value={formData.matriculaMercantil}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Constitución
                      </label>
                      <input
                        type="date"
                        name="fechaDeConstitucion"
                        value={formData.fechaDeConstitucion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-4 pt-4 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Vista de Información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Usuario</p>
                  <p className="text-lg font-semibold capitalize">{profile.userType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Persona</p>
                  <p className="text-lg font-semibold capitalize">{profile.personType}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="text-lg font-medium">
                      {[profile.firstName, profile.middleName, profile.lastName, profile.secondLastName].filter(Boolean).join(' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                    <p className="text-lg font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(profile.birthDate).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documento de Identidad
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="text-lg font-medium">{profile.documentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Número</p>
                    <p className="text-lg font-medium">{profile.documentNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Expedición</p>
                    <p className="text-lg font-medium">{new Date(profile.documentIssueDate).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-lg font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {profile.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ubicación
                </h2>
                <div className="text-gray-700">
                  <p>{profile.address}</p>
                  <p>{profile.city}, {profile.state}</p>
                  <p>{profile.country}</p>
                </div>
              </div>

              {profile.personType === 'natural' && profile.nitPersonaNatural && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Persona Natural</h2>
                  <p className="text-sm text-gray-600">NIT</p>
                  <p className="text-lg font-medium">{profile.nitPersonaNatural}</p>
                </div>
              )}

              {profile.personType === 'juridica' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Persona Jurídica
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.razonSocial && (
                      <div>
                        <p className="text-sm text-gray-600">Razón Social</p>
                        <p className="text-lg font-medium">{profile.razonSocial}</p>
                      </div>
                    )}
                    {profile.sociedad && (
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Sociedad</p>
                        <p className="text-lg font-medium">{profile.sociedad}</p>
                      </div>
                    )}
                    {profile.nitPersonaJuridica && (
                      <div>
                        <p className="text-sm text-gray-600">NIT</p>
                        <p className="text-lg font-medium">{profile.nitPersonaJuridica}</p>
                      </div>
                    )}
                    {profile.matriculaMercantil && (
                      <div>
                        <p className="text-sm text-gray-600">Matrícula Mercantil</p>
                        <p className="text-lg font-medium">{profile.matriculaMercantil}</p>
                      </div>
                    )}
                    {profile.fechaDeConstitucion && (
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Constitución</p>
                        <p className="text-lg font-medium">
                          {new Date(profile.fechaDeConstitucion).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No se encontró información del perfil</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
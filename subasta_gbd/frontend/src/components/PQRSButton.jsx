import { useState } from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import PQRSForm from './PQRSForm';

/**
 * Componente para mostrar un botón que abre el formulario PQRS
 * preseleccionado con un producto y usuario específico
 * 
 * @param {Object} product - El producto relacionado con la PQRS
 * @param {Object} targetUser - El usuario destinatario (vendedor o comprador)
 * @param {string} buttonText - Texto del botón (opcional)
 * @param {string} variant - Estilo del botón: 'primary', 'secondary', 'minimal'
 */
export default function PQRSButton({ 
  product, 
  targetUser, 
  buttonText = 'Reportar problema',
  variant = 'secondary' 
}) {
  const [showForm, setShowForm] = useState(false);

  const buttonStyles = {
  
    secondary: 'px-2 mt-4 text-[#fa7942] text-sm font-semibold transition-colors flex items-center justify-center gap-2',
  
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className={buttonStyles[variant]}
      >
        <AlertCircle className="w-4 h-4" />
        {buttonText}
      </button>

      {showForm && (
        <div className="fixed inset-0  bg-black/80 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <PQRSForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
              }}
              preselectedProduct={product?._id}
              preselectedUser={targetUser?._id}
            />
          </div>
        </div>
      )}
    </>
  );
}

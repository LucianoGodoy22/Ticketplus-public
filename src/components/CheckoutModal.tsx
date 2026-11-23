import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, CreditCard, X } from 'lucide-react';

interface Evento {
  id: number;
  nombre: string;
  precioDesde: number;
}

interface CheckoutModalProps {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

export default function CheckoutModal({ evento, isOpen, onClose, apiUrl }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [email, setEmail] = useState('cliente@ticketplus.com');
  const [forzarError, setForzarError] = useState(false);

  if (!isOpen || !evento) return null;

  const handlePago = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    try {
      const montoFinal = forzarError ? -5000 : evento.precioDesde;

      const payload = {
        eventoId: evento.id,
        emailUsuario: email,
        monto: montoFinal,
      };

      const baseUrl = apiUrl.replace(/\/+$/, '');
      await axios.post(`${baseUrl}/api/bff/pagos`, payload);

      setTimeout(() => setStep('success'), 1500);
    } catch (error) {
      console.error('Error procesando pago:', error);
      setTimeout(() => setStep('error'), 1500);
    }
  };

  const cerrarModal = () => {
    setStep('form');
    setForzarError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md border border-gray-200 border-t-4 border-t-orange-500 shadow-xl w-full max-w-md overflow-hidden relative">
        {/* Botón Cerrar */}
        {step !== 'processing' && (
          <button
            onClick={cerrarModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ESTADO 1: FORMULARIO */}
        {step === 'form' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Completar Pago</h2>
            <p className="text-sm text-gray-500 mb-6">{evento.nombre}</p>

            <form onSubmit={handlePago} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico (Para envío de Ticket)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarjeta de Crédito
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    required
                  />
                </div>
                <div className="flex gap-4 mt-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Checkbox para el profesor */}
              <div className="pt-2 pb-2">
                <label className="flex items-center space-x-2 bg-red-50 p-2.5 rounded-md border border-red-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forzarError}
                    onChange={(e) => setForzarError(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-red-800 font-semibold">
                    🧪 [Demo] Forzar Monto Negativo (DLQ Test)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition-colors"
              >
                Pagar ${evento.precioDesde.toLocaleString('es-CL')}
              </button>
            </form>
          </div>
        )}

        {/* ESTADO 2: PROCESANDO */}
        {step === 'processing' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <h3 className="text-lg font-bold text-gray-900">Procesando pago...</h3>
            <p className="text-sm text-gray-500">Conectando con la pasarela segura</p>
          </div>
        )}

        {/* ESTADO 3: ÉXITO */}
        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h3>
            <p className="text-sm text-gray-600">
              Tu pago ha sido procesado mediante RabbitMQ. Revisa el backend para ver la confirmación.
            </p>
            <button
              onClick={cerrarModal}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* ESTADO 4: ERROR (Para la DLQ) */}
        {step === 'error' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-600" />
            <h3 className="text-2xl font-bold text-gray-900">Pago Rechazado</h3>
            <p className="text-sm text-gray-600">
              El mensaje falló en la validación o fue rechazado (NACK) y ha sido enviado a la Dead Letter Queue.
            </p>
            <button
              onClick={cerrarModal}
              className="mt-4 bg-white border border-gray-300 text-gray-800 hover:border-orange-500 hover:text-orange-600 font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Usamos la misma estructura que definimos en el backend
interface Evento {
  id: number;
  nombre: string;
  recinto: string;
  fecha: string;
  precioDesde: number;
  imagenUrl: string;
  destacado: boolean;
}

export default function Home() {
  const [eventosDestacados, setEventosDestacados] = useState<Evento[]>([]);
  const [otrosEventos, setOtrosEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // La URL base ahora apuntará a tu API Gateway
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get<Evento[]>(`${apiUrl}/api/bff/eventos`);
        const todosLosEventos = response.data;
        
        setEventosDestacados(todosLosEventos.filter(e => e.destacado));
        setOtrosEventos(todosLosEventos.filter(e => !e.destacado));
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [apiUrl]);

  // Función para compra normal (Monto positivo -> ACK)
  const comprarTicket = async (eventoId: number, precio: number) => {
    try {
      const payload = {
        eventoId: eventoId,
        emailUsuario: "cliente@ticketplus.com",
        monto: precio
      };
      await axios.post(`${apiUrl}/api/bff/pagos`, payload);
      alert("¡Pago procesado con éxito! Revisa los logs del ms-eventos para ver la simulación del PDF.");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Ocurrió un error al intentar procesar el pago.");
    }
  };

  // Función para forzar error (Monto negativo -> NACK -> DLQ)
  const forzarErrorDLQ = async (eventoId: number) => {
    try {
      const payload = {
        eventoId: eventoId,
        emailUsuario: "cliente@ticketplus.com",
        monto: -5000 // Monto negativo intencional
      };
      await axios.post(`${apiUrl}/api/bff/pagos`, payload);
      alert("¡Pago simulado con error! Revisa el panel de RabbitMQ; el mensaje debería estar en la DLQ.");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Cargando eventos...</div>;
  }

  return (
    <div className="space-y-12">
      {/* Sección Eventos Destacados */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Eventos Destacados</h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide">
          {eventosDestacados.map((evento) => (
            <div key={evento.id} className="min-w-[300px] md:min-w-[400px] snap-center bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 border border-gray-100">
              <div className="h-48 bg-blue-100 w-full flex items-center justify-center text-blue-300">
                <span className="font-medium">Sin Imagen</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{evento.nombre}</h3>
                <p className="text-gray-500 text-sm mb-3">{evento.recinto} • {evento.fecha}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => comprarTicket(evento.id, evento.precioDesde)}
                    className="flex-1 bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    Comprar Tickets
                  </button>
                  
                  {/* Botón para demostrar funcionalidad al profesor */}
                  <button 
                    onClick={() => forzarErrorDLQ(evento.id)}
                    title="Forzar error para DLQ"
                    className="bg-red-50 text-red-600 font-bold px-4 rounded-lg hover:bg-red-100 transition-colors">
                    !
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Otros Eventos */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Próximos Eventos</h2>
          <Link to="/eventos" className="text-blue-600 font-medium hover:underline">
            Ver más →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otrosEventos.map((evento) => (
            <div key={evento.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 w-full"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{evento.nombre}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    Desde ${evento.precioDesde.toLocaleString('es-CL')}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{evento.recinto} • {evento.fecha}</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => comprarTicket(evento.id, evento.precioDesde)}
                    className="flex-1 text-sm bg-blue-50 text-blue-600 font-semibold py-1.5 rounded hover:bg-blue-100 transition-colors">
                    Comprar
                  </button>
                  <button 
                    onClick={() => forzarErrorDLQ(evento.id)}
                    title="Forzar error para DLQ"
                    className="text-sm bg-red-50 text-red-600 font-bold px-3 rounded hover:bg-red-100 transition-colors">
                    !
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
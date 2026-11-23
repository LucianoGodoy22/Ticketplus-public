import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CheckoutModal from '../components/CheckoutModal';

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

  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get<Evento[]>(`${apiUrl}/api/bff/eventos`);
        const todosLosEventos = response.data;

        setEventosDestacados(todosLosEventos.filter((e) => e.destacado));
        setOtrosEventos(todosLosEventos.filter((e) => !e.destacado));
      } catch (error) {
        console.error('Error cargando eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [apiUrl]);

  const abrirModalPago = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Cargando eventos...</div>;
  }

  return (
    <div className="space-y-10 relative">
      {/* Banner superior estilo Admin */}
      <div className="bg-white border border-gray-200 border-t-4 border-t-orange-500 rounded-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cartelera TicketPlus</h1>
          <p className="text-sm text-gray-500 mt-1">
            Descubre los próximos conciertos, espectáculos y compra tus entradas al instante.
          </p>
        </div>
        <Link
          to="/eventos"
          className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-800 hover:border-orange-500 hover:text-orange-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Ver todos los eventos
        </Link>
      </div>

      {/* Sección Eventos Destacados */}
      <section>
        <h2 className="text-xl font-bold mb-5 text-gray-900 border-l-4 border-orange-500 pl-3">
          Eventos Destacados
        </h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide">
          {eventosDestacados.map((evento) => (
            <div
              key={evento.id}
              className="min-w-[300px] md:min-w-[380px] snap-center bg-white rounded-md border border-gray-200 hover:border-orange-400 transition-colors overflow-hidden flex-shrink-0"
            >
              <div className="h-48 bg-orange-50 w-full flex items-center justify-center text-orange-400 border-b border-gray-100">
                {evento.imagenUrl ? (
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-sm">Sin Imagen</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{evento.nombre}</h3>
                  <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                    ${evento.precioDesde.toLocaleString('es-CL')}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {evento.recinto} • {evento.fecha}
                </p>
                <button
                  onClick={() => abrirModalPago(evento)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition-colors text-sm"
                >
                  Comprar Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Otros Eventos */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-orange-500 pl-3">
            Próximos Eventos
          </h2>
          <Link to="/eventos" className="text-orange-600 text-sm font-medium hover:underline">
            Ver más →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otrosEventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-md border border-gray-200 hover:border-orange-400 transition-colors overflow-hidden"
            >
              <div className="h-40 bg-gray-100 w-full flex items-center justify-center text-gray-400 border-b border-gray-100">
                {evento.imagenUrl ? (
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs">Sin Imagen</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{evento.nombre}</h3>
                  <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">
                    Desde ${evento.precioDesde.toLocaleString('es-CL')}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {evento.recinto} • {evento.fecha}
                </p>
                <button
                  onClick={() => abrirModalPago(evento)}
                  className="w-full text-sm bg-orange-50 text-orange-600 border border-orange-200 font-semibold py-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CheckoutModal
        evento={eventoSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiUrl={apiUrl}
      />
    </div>
  );
}
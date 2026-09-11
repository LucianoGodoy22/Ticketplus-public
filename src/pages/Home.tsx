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

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // En el futuro, esta URL apuntará al API Gateway / BFF
        const response = await axios.get<Evento[]>('http://localhost:8080/api/bff/eventos');
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
  }, []);

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
                {/* Placeholder para imagenUrl */}
                <span className="font-medium">Sin Imagen</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{evento.nombre}</h3>
                <p className="text-gray-500 text-sm mb-3">{evento.recinto} • {evento.fecha}</p>
                <button className="w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Comprar Tickets
                </button>
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
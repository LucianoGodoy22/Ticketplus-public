import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, ArrowUpDown, X } from 'lucide-react';
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

export default function Events() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'destacados'>('todos');
  const [ordenPrecio, setOrdenPrecio] = useState<'default' | 'asc' | 'desc'>('default');

  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setError(null);
        const response = await axios.get<Evento[]>(`${apiUrl}/api/bff/eventos`);
        setEventos(response.data);
      } catch (err) {
        console.error('Error cargando eventos:', err);
        setError('No se pudieron cargar los eventos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [apiUrl]);

  const eventosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    const filtrados = eventos.filter((evento) => {
      const coincideTipo = filtroTipo === 'todos' || evento.destacado;
      const coincideTexto =
        !termino ||
        evento.nombre.toLowerCase().includes(termino) ||
        evento.recinto.toLowerCase().includes(termino) ||
        evento.fecha.toLowerCase().includes(termino);

      return coincideTipo && coincideTexto;
    });

    if (ordenPrecio === 'asc') {
      return [...filtrados].sort((a, b) => a.precioDesde - b.precioDesde);
    }
    if (ordenPrecio === 'desc') {
      return [...filtrados].sort((a, b) => b.precioDesde - a.precioDesde);
    }
    return filtrados;
  }, [eventos, busqueda, filtroTipo, ordenPrecio]);

  const alternarOrdenPrecio = () => {
    setOrdenPrecio((prev) =>
      prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default'
    );
  };

  const abrirModalPago = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-md border border-gray-200 border-t-4 border-t-orange-500">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="block w-full pl-10 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
            placeholder="Buscar por artista, evento, recinto o fecha..."
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as 'todos' | 'destacados')}
            className="flex-1 md:flex-none border border-gray-300 text-gray-700 py-2 px-4 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="todos">Todos los eventos</option>
            <option value="destacados">Solo destacados</option>
          </select>

          <button
            type="button"
            onClick={alternarOrdenPrecio}
            className={`flex items-center gap-2 border px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              ordenPrecio !== 'default'
                ? 'bg-orange-50 border-orange-400 text-orange-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600'
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>
              {ordenPrecio === 'asc'
                ? 'Precio: menor a mayor'
                : ordenPrecio === 'desc'
                ? 'Precio: mayor a menor'
                : 'Ordenar precio'}
            </span>
          </button>
        </div>
      </div>

      {/* Estados de carga, error o resultados */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Cargando eventos...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 text-sm">
          {error}
        </div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-10 text-center space-y-3">
          <p className="text-gray-600 text-sm">
            No se encontraron eventos que coincidan con tu búsqueda.
          </p>
          {(busqueda || filtroTipo !== 'todos') && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('');
                setFiltroTipo('todos');
              }}
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {eventosFiltrados.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-md border border-gray-200 hover:border-orange-400 transition-colors overflow-hidden flex flex-col"
            >
              <div className="h-36 bg-orange-50 w-full flex items-center justify-center text-orange-400 border-b border-gray-100 relative">
                {evento.imagenUrl ? (
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium">Sin Imagen</span>
                )}
                {evento.destacado && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    Destacado
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{evento.nombre}</h3>
                    <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">
                      ${evento.precioDesde.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-4">
                    {evento.recinto} • {evento.fecha}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => abrirModalPago(evento)}
                  className="w-full text-sm bg-orange-50 text-orange-600 border border-orange-200 font-semibold py-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Comprar Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CheckoutModal
        evento={eventoSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiUrl={apiUrl}
      />
    </div>
  );
}
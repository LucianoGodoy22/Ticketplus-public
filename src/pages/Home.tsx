import { Link } from 'react-router-dom';

const MOCK_DESTACADOS = [1, 2, 3, 4];
const MOCK_OTROS = [1, 2, 3, 4, 5, 6];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Sección Eventos Destacados (Carrusel) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Eventos Destacados</h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide">
          {MOCK_DESTACADOS.map((item) => (
            <div key={item} className="min-w-[300px] md:min-w-[400px] snap-center bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 border border-gray-100">
              <div className="h-48 bg-gray-200 w-full animate-pulse"></div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">Concierto Destacado {item}</h3>
                <p className="text-gray-500 text-sm mb-3">Movistar Arena • 15 Octubre</p>
                <button className="w-full bg-gray-100 text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">
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
          {MOCK_OTROS.map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 w-full"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">Evento General {item}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Desde $15.000</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">Teatro Caupolicán • Noviembre</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
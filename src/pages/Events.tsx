import { Search, Filter } from 'lucide-react';

export default function Events() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            placeholder="Buscar por artista, evento o recinto..."
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:flex-none border border-gray-300 text-gray-700 py-2 px-4 rounded-lg bg-gray-50 focus:ring-blue-500">
            <option>Todas las categorías</option>
            <option>Conciertos</option>
            <option>Teatro</option>
            <option>Deportes</option>
          </select>
          <button className="flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Grid de resultados de búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gray-200 w-full"></div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-sm mb-1">Resultado {item}</h3>
              <p className="text-gray-500 text-xs">Ubicación • Fecha</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
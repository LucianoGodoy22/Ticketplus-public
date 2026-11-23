import { Link } from 'react-router-dom';
import { Ticket, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b-2 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <Ticket className="h-7 w-7 text-orange-500" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xl tracking-tight text-gray-900">TicketPlus</span>
              <span className="text-[11px] text-gray-500">Portal de Eventos</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/eventos"
              className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md font-medium text-sm transition-colors"
            >
              Explorar Eventos
            </Link>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <User className="h-4 w-4" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
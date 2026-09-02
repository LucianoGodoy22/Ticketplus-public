import { Link } from 'react-router-dom';
import { Ticket, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Ticket className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-blue-900">Ticketplus</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/eventos" className="text-gray-600 hover:text-blue-600 font-medium">
              Explorar Eventos
            </Link>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <User className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
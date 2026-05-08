import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/dashboard" className="text-xl font-bold text-blue-400">📋 TaskManager</Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-300">
              👤 {user.name}
              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${user.role === 'admin' ? 'bg-yellow-500 text-black font-bold' : 'bg-blue-600'}`}>
                {user.role === 'admin' ? '👑 Admin' : 'Member'}
              </span>
            </span>
            <Link to="/projects" className="text-sm hover:text-blue-400">Projects</Link>
            <Link to="/dashboard" className="text-sm hover:text-blue-400">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded-lg">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-bold text-blue-600">EduBridge LMS</Link>
          <Link to="/courses" className="text-sm text-muted-foreground">Courses</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
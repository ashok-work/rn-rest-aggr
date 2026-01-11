
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm px-4 md:px-10 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-orange-500 p-2 rounded-lg">
          <i className="fas fa-utensils text-white"></i>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">BiteDash</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}>Home</Link>
        <Link to="/favorites" className={`text-sm font-medium ${location.pathname === '/favorites' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
          <i className="fas fa-heart mr-1"></i> Favorites
        </Link>
        <Link to="/orders" className={`text-sm font-medium ${location.pathname === '/orders' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}>Orders</Link>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/account" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-600">
              <img src={user?.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="Profile" />
              <span className="font-semibold">{user?.name}</span>
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-all shadow-md">Login</Link>
        )}
      </div>

      {/* Mobile Nav Top */}
      <div className="md:hidden flex space-x-4 items-center">
        {isAuthenticated && (
           <Link to="/account">
              <img src={user?.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="Profile" />
           </Link>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
        <Link to="/" className={`flex flex-col items-center text-xs space-y-1 ${location.pathname === '/' ? 'text-orange-600' : 'text-gray-400'}`}>
          <i className="fas fa-home text-lg"></i>
          <span>Home</span>
        </Link>
        <Link to="/favorites" className={`flex flex-col items-center text-xs space-y-1 ${location.pathname === '/favorites' ? 'text-red-500' : 'text-gray-400'}`}>
          <i className="fas fa-heart text-lg"></i>
          <span>Favs</span>
        </Link>
        <Link to="/orders" className={`flex flex-col items-center text-xs space-y-1 ${location.pathname.startsWith('/orders') ? 'text-orange-600' : 'text-gray-400'}`}>
          <i className="fas fa-receipt text-lg"></i>
          <span>Orders</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center text-xs space-y-1 ${location.pathname === '/account' ? 'text-orange-600' : 'text-gray-400'}`}>
          <i className="fas fa-user text-lg"></i>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

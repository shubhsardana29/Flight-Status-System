import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaPlane className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">Interglobe Aviation</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/status" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-indigo-700">Discover Flights</Link>
            <Link to="/" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-indigo-700">Check Status</Link>
            <Link to="/" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-indigo-700">Contact Us</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out">Sign Up</Link>
                <Link to="/login" className="bg-white text-indigo-900 hover:bg-indigo-100 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out">Sign In</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center">
                <FaUser className="mr-2" />
                Logout
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-indigo-200 focus:outline-none">
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/status" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Flights</Link>
            <Link to="/offers" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Offers</Link>
            <Link to="/contact" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact Us</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-700">
            {!token ? (
              <div className="flex items-center px-5 space-y-2 flex-col">
                <Link to="/register" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-center">Sign Up</Link>
                <Link to="/login" className="w-full bg-white text-indigo-900 hover:bg-indigo-100 font-medium py-2 px-4 rounded-md text-center">Sign In</Link>
              </div>
            ) : (
              <div className="px-5">
                <button onClick={handleLogout} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
                  <FaUser className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignInAlt, FaHome, FaBars } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path) =>
    location.pathname === path
      ? "block px-3 py-2 rounded-md text-white bg-slate-700 transition"
      : "block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition";

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-slate-700 flex items-center space-x-2">
              <span>Attrition Shield</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className={getLinkClass("/")}>
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/login" className={getLinkClass("/login")}>
              <FaSignInAlt className="mr-2" /> Login
            </Link>
            <Link to="/signup" className={getLinkClass("/signup")}>
              <FaUser className="mr-2" /> Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link to="/" className={getLinkClass("/")} onClick={() => setIsOpen(false)}>
            <FaHome className="mr-2" /> Home
          </Link>
          <Link to="/login" className={getLinkClass("/login")} onClick={() => setIsOpen(false)}>
            <FaSignInAlt className="mr-2" /> Login
          </Link>
          <Link to="/signup" className={getLinkClass("/signup")} onClick={() => setIsOpen(false)}>
            <FaUser className="mr-2" /> Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
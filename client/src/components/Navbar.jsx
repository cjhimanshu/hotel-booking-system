import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const navClasses = isHomePage
    ? "absolute top-0 left-0 right-0 z-50 bg-transparent"
    : "sticky top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg";
  const textClasses = isHomePage ? "text-white drop-shadow-lg" : "text-white";
  const logoClasses = isHomePage ? "text-white drop-shadow-lg" : "text-white";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3"
            onClick={closeMenu}
          >
            <span className="text-xl sm:text-2xl">🏨</span>
            <span
              className={`text-lg sm:text-2xl font-serif font-bold tracking-wider ${logoClasses}`}
            >
              LUXURY STAY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <a
                href="#rooms"
                className={`hover:text-amber-300 font-medium transition uppercase tracking-widest text-sm ${textClasses}`}
              >
                Rooms
              </a>
            ) : (
              <Link
                to="/#rooms"
                className={`hover:text-amber-300 font-medium transition uppercase tracking-widest text-sm ${textClasses}`}
              >
                Rooms
              </Link>
            )}

            {user && (
              <Link
                to="/my-bookings"
                className={`hover:text-amber-300 font-medium transition uppercase tracking-widest text-sm ${textClasses}`}
              >
                My Bookings
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`hover:text-amber-300 font-medium transition uppercase tracking-widest text-sm ${textClasses}`}
              >
                Admin
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/register"
                  className="border border-amber-400 text-amber-300 px-6 py-2 rounded-sm hover:bg-amber-400 hover:text-white transition font-medium shadow-lg uppercase tracking-wider text-sm"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-amber-600 text-white px-6 py-2 rounded-sm hover:bg-amber-700 transition font-medium shadow-lg uppercase tracking-wider text-sm"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-amber-600 text-white px-6 py-2 rounded-sm hover:bg-amber-700 transition font-medium shadow-lg uppercase tracking-wider text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Hamburger Button (mobile only) */}
          <button
            className={`md:hidden p-2 rounded-md hover:text-amber-300 transition ${textClasses}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden py-4 border-t ${
              isHomePage
                ? "border-white/20 bg-black/60 backdrop-blur-sm"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <div className="flex flex-col space-y-1 pb-2">
              {isHomePage ? (
                <a
                  href="#rooms"
                  onClick={closeMenu}
                  className="px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 font-medium uppercase tracking-widest text-sm transition rounded-md"
                >
                  Rooms
                </a>
              ) : (
                <Link
                  to="/#rooms"
                  onClick={closeMenu}
                  className="px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 font-medium uppercase tracking-widest text-sm transition rounded-md"
                >
                  Rooms
                </Link>
              )}

              {user && (
                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 font-medium uppercase tracking-widest text-sm transition rounded-md"
                >
                  My Bookings
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="px-4 py-3 text-white hover:text-amber-300 hover:bg-white/10 font-medium uppercase tracking-widest text-sm transition rounded-md"
                >
                  Admin
                </Link>
              )}

              <div className="pt-2 px-4">
                {!user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="text-center border border-amber-400 text-amber-300 px-6 py-3 rounded-sm hover:bg-amber-400 hover:text-white transition font-medium shadow-lg uppercase tracking-wider text-sm"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="text-center bg-amber-600 text-white px-6 py-3 rounded-sm hover:bg-amber-700 transition font-medium shadow-lg uppercase tracking-wider text-sm"
                    >
                      Login
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-amber-600 text-white px-6 py-3 rounded-sm hover:bg-amber-700 transition font-medium shadow-lg uppercase tracking-wider text-sm"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

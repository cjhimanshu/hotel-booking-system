import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Use transparent navbar only on home page
  const isHomePage = location.pathname === "/";
  const navClasses = isHomePage
    ? "absolute top-0 left-0 right-0 z-50 bg-transparent"
    : "sticky top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg";
  const textClasses = isHomePage ? "text-white drop-shadow-lg" : "text-white";
  const logoClasses = isHomePage ? "text-white drop-shadow-lg" : "text-white";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🏨</span>
            <span
              className={`text-2xl font-serif font-bold tracking-wider ${logoClasses}`}
            >
              LUXURY STAY
            </span>
          </Link>

          <div className="flex items-center space-x-8">
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
                  to="/login"
                  className={`hover:text-amber-300 font-medium transition uppercase tracking-widest text-sm ${textClasses}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-6 py-2 rounded-sm hover:bg-amber-700 transition font-medium shadow-lg uppercase tracking-wider text-sm"
                >
                  Register
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

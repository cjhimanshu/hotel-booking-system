import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🏨</span>
            <span className="text-2xl font-serif font-bold text-white drop-shadow-lg tracking-wider">
              LUXURY STAY
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-amber-300 font-medium transition drop-shadow-lg uppercase tracking-widest text-sm"
            >
              Rooms
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className="text-white hover:text-amber-300 font-medium transition drop-shadow-lg uppercase tracking-widest text-sm"
              >
                My Bookings
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-white hover:text-amber-300 font-medium transition drop-shadow-lg uppercase tracking-widest text-sm"
              >
                Admin
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-amber-300 font-medium transition drop-shadow-lg uppercase tracking-widest text-sm"
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

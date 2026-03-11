import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const MyBookings = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setLoading(true);
    API.get("/bookings/user")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  const cancel = (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    API.delete(`/bookings/${id}`).then(() => {
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
      alert("Booking cancelled successfully");
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20 sm:pt-28 pb-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            My Bookings
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 self-start sm:self-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {loading && (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-12 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-xl text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-lg text-center">
                <div className="text-6xl mb-4">🏨</div>
                <p className="text-xl text-gray-600">No bookings yet</p>
                <a
                  href="/rooms"
                  className="mt-4 inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700"
                >
                  Browse Rooms
                </a>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {booking.room?.name || booking.room?.type}
                      </h3>
                      <p className="text-gray-600">
                        {booking.room?.description}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-2xl sm:text-3xl font-bold text-amber-600">
                        ₹{booking.totalPrice}
                      </div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Stay Details
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-800">
                          <span className="font-semibold">Check-In:</span>{" "}
                          {new Date(booking.checkIn).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-gray-800">
                          <span className="font-semibold">Check-Out:</span>{" "}
                          {new Date(booking.checkOut).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        {booking.numberOfGuests && (
                          <p className="text-gray-800">
                            <span className="font-semibold">Guests:</span>{" "}
                            {booking.numberOfGuests}
                          </p>
                        )}
                      </div>
                    </div>

                    {booking.guestDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          Guest Information
                        </div>
                        <div className="space-y-1">
                          {booking.guestDetails.name && (
                            <p className="text-gray-800">
                              <span className="font-semibold">Name:</span>{" "}
                              {booking.guestDetails.name}
                            </p>
                          )}
                          {booking.guestDetails.email && (
                            <p className="text-gray-800">
                              <span className="font-semibold">Email:</span>{" "}
                              {booking.guestDetails.email}
                            </p>
                          )}
                          {booking.guestDetails.phone && (
                            <p className="text-gray-800">
                              <span className="font-semibold">Phone:</span>{" "}
                              {booking.guestDetails.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {booking.guestDetails?.specialRequests && (
                    <div className="bg-amber-50 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Special Requests
                      </p>
                      <p className="text-gray-800">
                        {booking.guestDetails.specialRequests}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status?.toUpperCase()}
                      </span>
                      {booking.paymentStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                            booking.paymentStatus,
                          )}`}
                        >
                          Payment: {booking.paymentStatus?.toUpperCase()}
                        </span>
                      )}
                      {booking.paymentMethod && (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                          {booking.paymentMethod
                            ?.replace("_", " ")
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => cancel(booking._id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

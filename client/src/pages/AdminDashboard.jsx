import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingRoomId, setUploadingRoomId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState([]);

  useEffect(() => {
    Promise.all([API.get("/rooms"), API.get("/bookings/all")])
      .then(([roomsRes, bookingsRes]) => {
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const deleteRoom = (id) => {
    if (confirm("Are you sure you want to delete this room?")) {
      API.delete(`/rooms/${id}`).then(() => {
        setRooms(rooms.filter((r) => r._id !== id));
        alert("Room deleted successfully!");
      });
    }
  };

  const handleImageUpload = async (roomId) => {
    if (!uploadingImages || uploadingImages.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    for (let img of uploadingImages) {
      formData.append("images", img);
    }

    try {
      const { data } = await API.put(`/rooms/${roomId}/images`, formData);

      // Update the room in the list
      setRooms(rooms.map((r) => (r._id === roomId ? data : r)));

      // Reset upload state
      setUploadingRoomId(null);
      setUploadingImages([]);

      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const cancelUpload = () => {
    setUploadingRoomId(null);
    setUploadingImages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your hotel rooms and bookings
              </p>
            </div>
            <Link
              to="/admin/add-room"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add New Room
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">🏨</div>
            <div className="text-3xl font-bold text-gray-800">
              {rooms.length}
            </div>
            <div className="text-gray-600">Total Rooms</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">
              {rooms.filter((r) => r.isAvailable).length}
            </div>
            <div className="text-gray-600">Available Rooms</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">�</div>
            <div className="text-3xl font-bold text-purple-600">
              {bookings.filter((b) => b.status !== "cancelled").length}
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-blue-600">
              ₹
              {bookings
                .filter((b) => b.status !== "cancelled")
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Booking Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category-wise Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Bookings by Room Type
            </h3>
            <div className="space-y-4">
              {(() => {
                const categoryStats = {};
                bookings
                  .filter((b) => b.status !== "cancelled" && b.room)
                  .forEach((booking) => {
                    const roomType = booking.room.type || "Unknown";
                    if (!categoryStats[roomType]) {
                      categoryStats[roomType] = { count: 0, revenue: 0 };
                    }
                    categoryStats[roomType].count += 1;
                    categoryStats[roomType].revenue += booking.totalPrice || 0;
                  });

                return Object.entries(categoryStats).length > 0 ? (
                  Object.entries(categoryStats).map(([type, stats]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {type}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stats.count} bookings
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          ₹{stats.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">revenue</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No bookings yet
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Daily Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Today's Activity
            </h3>
            <div className="space-y-4">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayBookings = bookings.filter((b) => {
                  const bookingDate = new Date(b.createdAt);
                  bookingDate.setHours(0, 0, 0, 0);
                  return (
                    bookingDate.getTime() === today.getTime() &&
                    b.status !== "cancelled"
                  );
                });

                const todayRevenue = todayBookings.reduce(
                  (sum, b) => sum + (b.totalPrice || 0),
                  0
                );

                const checkInsToday = bookings.filter((b) => {
                  const checkIn = new Date(b.checkIn);
                  checkIn.setHours(0, 0, 0, 0);
                  return (
                    checkIn.getTime() === today.getTime() &&
                    b.status !== "cancelled"
                  );
                });

                const checkOutsToday = bookings.filter((b) => {
                  const checkOut = new Date(b.checkOut);
                  checkOut.setHours(0, 0, 0, 0);
                  return (
                    checkOut.getTime() === today.getTime() &&
                    b.status !== "cancelled"
                  );
                });

                return (
                  <>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📝</span>
                        <div className="font-semibold text-gray-800">
                          New Bookings
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {todayBookings.length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ₹{todayRevenue.toLocaleString()} earned
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔑</span>
                        <div className="font-semibold text-gray-800">
                          Check-ins Today
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {checkInsToday.length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Guests arriving
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">👋</span>
                        <div className="font-semibold text-gray-800">
                          Check-outs Today
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-orange-600">
                        {checkOutsToday.length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Guests departing
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Rooms List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">All Rooms</h2>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-xl text-gray-600 mb-4">No rooms added yet</p>
              <Link
                to="/admin/add-room"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add Your First Room
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {rooms.map((room) => {
                const hasNoImages = !room.images || room.images.length === 0;

                return (
                  <div
                    key={room._id}
                    className={`p-6 transition-colors duration-200 ${
                      hasNoImages
                        ? "bg-orange-50 hover:bg-orange-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Image Preview or Placeholder */}
                      <div className="flex-shrink-0">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={room.images[0]}
                            alt={room.type}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-green-200"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center ${
                            hasNoImages
                              ? "border-orange-400 bg-orange-100 flex"
                              : "hidden"
                          }`}
                        >
                          <span className="text-3xl">⚠️</span>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-800">
                                {room.type}
                              </h3>
                              {hasNoImages && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-800 border border-orange-400 animate-pulse">
                                  ⚠️ NO IMAGE
                                </span>
                              )}
                              {room.images && room.images.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  ✓ {room.images.length} image
                                  {room.images.length > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Room #{room.roomNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            💰{" "}
                            <strong className="text-blue-600 text-lg">
                              ₹{room.price.toLocaleString()}
                            </strong>
                            /night
                          </span>
                          <span className="flex items-center gap-1">
                            👥 Max {room.maxGuests} guest
                            {room.maxGuests > 1 ? "s" : ""}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              room.isAvailable
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {room.isAvailable
                              ? "✅ Available"
                              : "❌ Unavailable"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {hasNoImages &&
                          (uploadingRoomId === room._id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                  setUploadingImages([...e.target.files])
                                }
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleImageUpload(room._id)}
                                  className="bg-green-500 text-white px-4 py-1 rounded text-sm font-semibold hover:bg-green-600 transition-colors"
                                >
                                  Upload
                                </button>
                                <button
                                  onClick={cancelUpload}
                                  className="bg-gray-400 text-white px-4 py-1 rounded text-sm font-semibold hover:bg-gray-500 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setUploadingRoomId(room._id)}
                              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
                            >
                              <span>📸</span>
                              Add Image
                            </button>
                          ))}
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

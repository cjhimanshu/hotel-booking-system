import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    API.get("/rooms")
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Define luxury room categories
  const categories = [
    { id: "all", name: "All Rooms", icon: "🏨" },
    { id: "luxury", name: "Luxury Suites", icon: "👑" },
    { id: "couple", name: "Couple Specials", icon: "💑" },
    { id: "family", name: "Family Rooms", icon: "👨‍👩‍👧‍👦" },
    { id: "premium", name: "Premium Views", icon: "🌆" },
  ];

  // Categorize rooms based on their type
  const categorizeRoom = (roomType) => {
    const type = roomType.toLowerCase();
    if (
      type.includes("maharaja") ||
      type.includes("presidential") ||
      type.includes("royal")
    ) {
      return "luxury";
    }
    if (type.includes("honeymoon") || type.includes("couple")) {
      return "couple";
    }
    if (
      type.includes("family") ||
      (type.includes("suite") && !type.includes("presidential"))
    ) {
      return "family";
    }
    if (
      type.includes("city view") ||
      type.includes("ocean") ||
      type.includes("garden")
    ) {
      return "premium";
    }
    return "standard";
  };

  // Filter rooms based on selected category
  const filteredRooms =
    selectedCategory === "all"
      ? rooms
      : rooms.filter((room) => categorizeRoom(room.type) === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-[75vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMi0yaDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4 font-medium">
                Welcome to
              </p>
              <h1 className="font-display text-6xl md:text-8xl font-light mb-6 tracking-wide leading-tight">
                LUXURY STAY
              </h1>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl mb-12 font-light tracking-wider text-gray-200 max-w-3xl mx-auto">
                EXPERIENCE COMFORT AND ELEGANCE IN EVERY ROOM
              </p>
              <div className="flex justify-center gap-6 flex-wrap">
                <a
                  href="#rooms"
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 uppercase tracking-widest text-sm shadow-2xl hover:shadow-amber-500/50 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Book Now
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </a>
                <a
                  href="#about"
                  className="group border-2 border-white/80 text-white px-10 py-4 rounded-sm font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 uppercase tracking-widest text-sm backdrop-blur-sm hover:scale-105"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold text-gray-900 mb-4">
              Discover Excellence
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in world-class hospitality with our curated
              selection of premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Luxury Rooms Card */}
            <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury Room"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium text-sm uppercase tracking-wider hover:bg-amber-600 hover:text-white transition-colors">
                    Explore Rooms
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-3xl font-semibold mb-4 text-gray-900">
                  Luxury Rooms
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Elegant rooms with premium amenities, plush bedding, modern
                  decor, and breathtaking views for an unforgettable stay
                </p>
                <div className="flex items-center text-amber-600 font-medium text-sm uppercase tracking-wider">
                  <span>Learn More</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Fine Dining Card */}
            <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
                  alt="Fine Dining"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium text-sm uppercase tracking-wider hover:bg-amber-600 hover:text-white transition-colors">
                    View Menu
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-3xl font-semibold mb-4 text-gray-900">
                  Fine Dining
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  World-class cuisine crafted by expert chefs, featuring
                  international flavors and local specialties in an elegant
                  atmosphere
                </p>
                <div className="flex items-center text-amber-600 font-medium text-sm uppercase tracking-wider">
                  <span>Learn More</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Premium Facilities Card */}
            <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80"
                  alt="Premium Facilities"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium text-sm uppercase tracking-wider hover:bg-amber-600 hover:text-white transition-colors">
                    View Facilities
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-3xl font-semibold mb-4 text-gray-900">
                  Premium Facilities
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  State-of-the-art pool, rejuvenating spa treatments,
                  fully-equipped fitness center, and exclusive leisure amenities
                </p>
                <div className="flex items-center text-amber-600 font-medium text-sm uppercase tracking-wider">
                  <span>Learn More</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Categories Filter */}
      <div id="rooms" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl font-bold text-gray-900 mb-4">
              Explore Our Rooms
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 text-sm uppercase tracking-wider ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-amber-300"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              {selectedCategory === "all"
                ? `Showing all ${rooms.length} rooms`
                : `${filteredRooms.length} ${
                    categories.find((c) => c.id === selectedCategory)?.name ||
                    "rooms"
                  } available`}
            </p>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-xl text-gray-600">
                No rooms available in this category.
              </p>
              <p className="text-gray-500 mt-2">
                Try selecting a different category or check all rooms.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View All Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => {
                const category = categorizeRoom(room.type);
                const categoryBadge = categories.find((c) => c.id === category);

                return (
                  <div
                    key={room._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={room.images[0]}
                          alt={room.type}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML =
                              '<span class="text-6xl">🛏️</span>';
                          }}
                        />
                      ) : (
                        <span className="text-6xl">🛏️</span>
                      )}
                      {categoryBadge && category !== "standard" && (
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                          {categoryBadge.icon} {categoryBadge.name}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">
                        {room.type}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Room #{room.roomNumber}
                      </p>
                      <p className="text-gray-600 mb-2">
                        👥 Max {room.maxGuests} Guests
                      </p>

                      {/* Availability Badge */}
                      <div className="mb-4">
                        {room.isAvailable ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            ✓ Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                            ✗ Not Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-blue-600">
                            ₹{room.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500"> /night</span>
                        </div>
                      </div>
                      <Link
                        to={`/book/${room._id}`}
                        className={`block w-full text-white text-center py-3 rounded-lg font-semibold transition ${
                          room.isAvailable
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={(e) => !room.isAvailable && e.preventDefault()}
                      >
                        {room.isAvailable ? "Book Now" : "Not Available"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Luxury Stay Hotel</h4>
              <p className="text-gray-400">Experience the finest hospitality</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-gray-400">📧 info@luxurystay.com</p>
              <p className="text-gray-400">📞 +91 1234567890</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <p className="text-gray-400">Facebook | Twitter | Instagram</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Luxury Stay Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Rooms;

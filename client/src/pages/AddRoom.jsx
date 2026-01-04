import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AddRoom = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    price: "",
    maxGuests: "",
  });
  const [images, setImages] = useState([]);
  const [selectedPresetImage, setSelectedPresetImage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  // Luxury room presets
  const luxuryRoomTypes = [
    {
      type: "Presidential Suite",
      price: 35000,
      guests: 4,
      category: "Ultra Luxury",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Royal Suite",
      price: 32000,
      guests: 4,
      category: "Ultra Luxury",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Penthouse Suite",
      price: 40000,
      guests: 5,
      category: "Ultra Luxury",
      image:
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Executive Suite",
      price: 18000,
      guests: 2,
      category: "Premium",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Sultan Suite",
      price: 38000,
      guests: 4,
      category: "Ultra Luxury",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Opulent Oasis",
      price: 28000,
      guests: 3,
      category: "Luxury",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Majestic Manor",
      price: 30000,
      guests: 4,
      category: "Luxury",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Crystal Cove",
      price: 22000,
      guests: 3,
      category: "Premium",
      image:
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Platinum Paradise",
      price: 26000,
      guests: 3,
      category: "Luxury",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Imperial Suite",
      price: 42000,
      guests: 5,
      category: "Ultra Luxury",
      image:
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Maharaja Suite",
      price: 35000,
      guests: 4,
      category: "Luxury",
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Honeymoon Paradise",
      price: 20000,
      guests: 2,
      category: "Romance",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Couple's Premium Retreat",
      price: 16000,
      guests: 2,
      category: "Romance",
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "City View Deluxe",
      price: 12000,
      guests: 2,
      category: "Standard",
      image:
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Ocean Breeze Suite",
      price: 24000,
      guests: 3,
      category: "Premium",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Garden View Room",
      price: 10000,
      guests: 2,
      category: "Standard",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Royal Family Suite",
      price: 28000,
      guests: 5,
      category: "Family",
      image:
        "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?auto=format&fit=crop&w=800&q=80",
    },
    {
      type: "Single Bed Classic",
      price: 5000,
      guests: 1,
      category: "Standard",
      image:
        "https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const selectPreset = (preset) => {
    setForm({
      ...form,
      type: preset.type,
      price: preset.price.toString(),
      maxGuests: preset.guests.toString(),
    });
    // Store the preset image URL
    setSelectedPresetImage(preset.image);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("roomNumber", form.roomNumber);
      formData.append("type", form.type);
      formData.append("price", form.price);
      formData.append("maxGuests", form.maxGuests);

      // If a preset image is selected and no files uploaded, use the preset image URL
      if (selectedPresetImage && images.length === 0) {
        formData.append("imageUrl", selectedPresetImage);
      }

      for (let img of images) {
        formData.append("images", img);
      }

      await API.post("/rooms", formData);
      alert("Room added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Add room error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add room. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Add New Luxury Room
          </h1>
          <p className="text-gray-600">
            Create a new room listing for your hotel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="e.g., 101, A-205"
                    value={form.roomNumber}
                    onChange={(e) =>
                      setForm({ ...form, roomNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="e.g., Maharaja Suite"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price per Night (₹) *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="5000"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Guests *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="2"
                      value={form.maxGuests}
                      onChange={(e) =>
                        setForm({ ...form, maxGuests: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Images
                  </label>

                  {/* Show preset image preview if selected */}
                  {selectedPresetImage && images.length === 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-blue-600 mb-2">
                        ✨ Preset image selected:
                      </p>
                      <img
                        src={selectedPresetImage}
                        alt="Room preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This image will be used unless you upload custom images
                        below
                      </p>
                    </div>
                  )}

                  {/* Show uploaded images preview */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-green-600 mb-2">
                        ✅ {imagePreviews.length} image
                        {imagePreviews.length > 1 ? "s" : ""} selected:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Upload preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...images];
                                const newPreviews = [...imagePreviews];
                                newImages.splice(index, 1);
                                newPreviews.splice(index, 1);
                                setImages(newImages);
                                setImagePreviews(newPreviews);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    onChange={(e) => {
                      const files = [...e.target.files];
                      setImages(files);

                      // Create preview URLs for uploaded images
                      const previews = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setImagePreviews(previews);

                      if (files.length > 0) {
                        setSelectedPresetImage(""); // Clear preset if custom images uploaded
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload multiple images (optional - will override preset
                    image)
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Room
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🏨 Luxury Room Presets
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Click to auto-fill room details
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {luxuryRoomTypes.map((preset, index) => {
                  const categoryColors = {
                    "Ultra Luxury": "bg-purple-100 text-purple-800",
                    Luxury: "bg-yellow-100 text-yellow-800",
                    Premium: "bg-blue-100 text-blue-800",
                    Romance: "bg-pink-100 text-pink-800",
                    Family: "bg-green-100 text-green-800",
                    Standard: "bg-gray-100 text-gray-800",
                  };

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectPreset(preset)}
                      className="w-full text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* Image thumbnail */}
                      <div className="h-24 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={preset.image}
                          alt={preset.type}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Room details */}
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-sm text-gray-800">
                            {preset.type}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              categoryColors[preset.category]
                            }`}
                          >
                            {preset.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          💰 ₹{preset.price.toLocaleString()}/night
                        </div>
                        <div className="text-xs text-gray-600">
                          👥 {preset.guests} guest{preset.guests > 1 ? "s" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;

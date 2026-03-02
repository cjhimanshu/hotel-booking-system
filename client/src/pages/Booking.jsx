import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [step, setStep] = useState(1);

  // Step 1: Dates
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Step 2: Guest Details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Validation errors
  const [emailError, setEmailError] = useState("");

  // OTP verification states (email only)
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // Calculate nights and totalPrice as derived values
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          Math.abs(new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = nights && room ? nights * room.price : 0;


  useEffect(() => {
    API.get(`/rooms/${id}`)
      .then((res) => {
        setRoom(res.data);
      })
      .catch((err) => {
        console.error("Error fetching room:", err);
      });
  }, [id]);

  const handleBooking = async () => {
    try {
      if (paymentMethod === "razorpay") {
        // Create Razorpay order
        const { data: orderData } = await API.post("/payment/create-order", {
          amount: totalPrice,
        });

        // Get Razorpay key
        const { data: keyData } = await API.get("/payment/key");

        // Initialize Razorpay payment
        const options = {
          key: keyData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Luxury Stay Hotel",
          description: `Booking for ${room.type}`,
          order_id: orderData.id,
          handler: async function (response) {
            try {
              // Verify payment
              const { data: verifyData } = await API.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyData.success) {
                // Create booking after successful payment
                await API.post("/bookings", {
                  room: id,
                  checkIn,
                  checkOut,
                  numberOfGuests,
                  totalPrice,
                  paymentMethod: "razorpay",
                  guestDetails: {
                    name: guestName,
                    email: guestEmail,
                    specialRequests,
                    paymentId: response.razorpay_payment_id,
                  },
                });
                alert("Booking confirmed! Payment processed successfully.");
                navigate("/my-bookings");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              const errorMsg =
                error.response?.data?.message ||
                error.message ||
                "Unknown error";
              alert(
                "Payment verification failed: " +
                  errorMsg +
                  "\nPlease contact support with your payment ID: " +
                  response.razorpay_payment_id,
              );
            }
          },
          prefill: {
            name: guestName,
            email: guestEmail,
          },
          theme: {
            color: "#D97706",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          alert("Payment failed: " + response.error.description);
        });
        rzp.open();
      } else {
        // Cash payment - create booking directly
        await API.post("/bookings", {
          room: id,
          checkIn,
          checkOut,
          numberOfGuests,
          totalPrice,
          paymentMethod,
          guestDetails: {
            name: guestName,
            email: guestEmail,
            specialRequests,
          },
        });
        alert("Booking confirmed! You can pay at the hotel.");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Error booking room", error);
      alert(
        "Error booking room: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const nextStep = () => {
    if (step === 1 && (!checkIn || !checkOut)) {
      alert("Please select check-in and check-out dates");
      return;
    }
    if (step === 2) {
      if (!guestName || !guestEmail) {
        alert("Please fill in all guest details");
        return;
      }
      if (!emailVerified) {
        alert("Please verify your email address with OTP");
        return;
      }
      setEmailError("");
    }
    setStep(step + 1);
  };

  const handleEmailChange = (e) => {
    setGuestEmail(e.target.value);
    setEmailError("");
    setEmailVerified(false);
    setEmailOtpSent(false);
    setEmailOtpInput("");
    setEmailOtpError("");
  };



  // Auto-load verified email when reaching step 2
  useEffect(() => {
    if (step === 2) {
      API.get("/verify/verified-contacts")
        .then((res) => {
          if (res.data.verifiedEmail) {
            setGuestEmail(res.data.verifiedEmail);
            setEmailVerified(true);
          }
        })
        .catch(() => {});
    }
  }, [step]);

  const handleSendEmailOtp = async () => {
    if (!guestEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailSending(true);
    setEmailOtpError("");
    try {
      const res = await API.post("/verify/send-email-otp", {
        email: guestEmail,
      });
      if (res.data.alreadyVerified) {
        setEmailVerified(true);
      } else {
        setEmailOtpSent(true);
      }
    } catch (err) {
      setEmailOtpError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtpInput) return;
    setEmailVerifying(true);
    setEmailOtpError("");
    try {
      await API.post("/verify/verify-email-otp", {
        email: guestEmail,
        otp: emailOtpInput,
      });
      setEmailVerified(true);
      setEmailOtpSent(false);
    } catch (err) {
      setEmailOtpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setEmailVerifying(false);
    }
  };



  const prevStep = () => setStep(step - 1);

  if (!room)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-semibold ${
                step >= 1 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              Dates & Guests
            </span>
            <span
              className={`text-sm font-semibold ${
                step >= 2 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              Guest Details
            </span>
            <span
              className={`text-sm font-semibold ${
                step >= 3 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              Payment
            </span>
            <span
              className={`text-sm font-semibold ${
                step >= 4 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              Confirmation
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Room Header */}
          <div className="relative h-64 bg-gradient-to-r from-amber-600 to-orange-600">
            {room.images && room.images.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.name || room.type}
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                ðŸ›ï¸
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {room.name || room.type}
                </h1>
                <p className="text-xl">â‚¹{room.price} per night</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Step 1: Dates & Guests */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Dates & Guests
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                    className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {nights > 0 && (
                  <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Nights:</span>
                      <span className="font-semibold text-gray-900">
                        {nights}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Price per night:</span>
                      <span className="font-semibold text-gray-900">
                        â‚¹{room.price}
                      </span>
                    </div>
                    <div className="border-t-2 border-amber-300 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-amber-600">
                          â‚¹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-amber-700 hover:to-orange-700 font-semibold text-lg transition-all shadow-lg"
                >
                  Continue to Guest Details
                </button>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Guest Information
                </h2>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Email with OTP */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                      {emailVerified && (
                        <span className="ml-2 text-green-600">âœ“ Verified</span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={handleEmailChange}
                        placeholder="john@example.com"
                        disabled={emailVerified}
                        className={`flex-1 border-2 px-4 py-3 rounded-lg focus:outline-none ${
                          emailVerified
                            ? "border-green-500 bg-green-50 text-green-800"
                            : emailError
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-amber-500"
                        }`}
                        required
                      />
                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={emailSending || !guestEmail}
                          className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {emailSending
                            ? "Sending..."
                            : emailOtpSent
                              ? "Resend"
                              : "Send OTP"}
                        </button>
                      )}
                      {emailVerified && (
                        <button
                          type="button"
                          onClick={() => {
                            setEmailVerified(false);
                            setEmailOtpSent(false);
                            setEmailOtpInput("");
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">
                        {emailError}
                      </p>
                    )}
                    {emailOtpSent && !emailVerified && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={emailOtpInput}
                          onChange={(e) => setEmailOtpInput(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1 border-2 border-amber-400 px-4 py-2 rounded-lg focus:border-amber-600 focus:outline-none tracking-widest text-center text-lg font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyEmailOtp}
                          disabled={
                            emailVerifying || emailOtpInput.length !== 6
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                        >
                          {emailVerifying ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    )}
                    {emailOtpError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">
                        {emailOtpError}
                      </p>
                    )}
                  </div>



                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Early check-in, late check-out, room preferences, etc."
                      rows="4"
                      className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-amber-500 focus:outline-none"
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="w-1/3 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!emailVerified || !guestName}
                    className="w-2/3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-amber-700 hover:to-orange-700 font-semibold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Payment Method
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-all">
                    <input
                      type="radio"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 w-5 h-5 text-amber-600"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">
                        Pay Now (Razorpay)
                      </span>
                      <p className="text-sm text-gray-600">
                        Credit/Debit Card, UPI, Net Banking, Wallet
                      </p>
                    </div>
                    <span className="text-2xl">ðŸ’³</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-all">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 w-5 h-5 text-amber-600"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">
                        Pay at Hotel
                      </span>
                      <p className="text-sm text-gray-600">
                        Pay cash when you arrive
                      </p>
                    </div>
                    <span className="text-2xl">ðŸ’µ</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="w-1/3 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-2/3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-amber-700 hover:to-orange-700 font-semibold text-lg transition-all shadow-lg"
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Review Your Booking
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Room Details
                    </h3>
                    <p className="text-gray-700">{room.name || room.type}</p>
                    {room.description && (
                      <p className="text-sm text-gray-600">
                        {room.description}
                      </p>
                    )}
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Stay Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-600">Check-In:</span>
                      <span className="font-semibold">
                        {new Date(checkIn).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600">Check-Out:</span>
                      <span className="font-semibold">
                        {new Date(checkOut).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-semibold">{nights}</span>
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-semibold">{numberOfGuests}</span>
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Guest Information
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-700">
                        <span className="font-semibold">Name:</span> {guestName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span>{" "}
                        {guestEmail}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span>{" "}
                        {guestPhone}
                      </p>
                      {specialRequests && (
                        <p className="text-gray-700">
                          <span className="font-semibold">
                            Special Requests:
                          </span>{" "}
                          {specialRequests}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Payment Method
                    </h3>
                    <p className="text-gray-700 capitalize">
                      {paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold text-amber-600">
                        â‚¹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="w-1/3 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    className="w-2/3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold text-lg transition-all shadow-lg"
                  >
                    Confirm & Pay â‚¹{totalPrice}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

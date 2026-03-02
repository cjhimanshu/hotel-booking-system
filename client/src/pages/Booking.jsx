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
  const [countryCode, setCountryCode] = useState("+91");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // OTP verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [phoneSending, setPhoneSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // Calculate nights and totalPrice as derived values
  const nights = checkIn && checkOut ? Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights && room ? nights * room.price : 0;

  // Country codes list
  const countryCodes = [
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
    { code: "+355", country: "Albania", flag: "🇦🇱" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+376", country: "Andorra", flag: "🇦🇩" },
    { code: "+244", country: "Angola", flag: "🇦🇴" },
    { code: "+1-268", country: "Antigua and Barbuda", flag: "🇦🇬" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+374", country: "Armenia", flag: "🇦🇲" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
    { code: "+1-242", country: "Bahamas", flag: "🇧🇸" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+1-246", country: "Barbados", flag: "🇧🇧" },
    { code: "+375", country: "Belarus", flag: "🇧🇾" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+501", country: "Belize", flag: "🇧🇿" },
    { code: "+229", country: "Benin", flag: "🇧🇯" },
    { code: "+975", country: "Bhutan", flag: "🇧🇹" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+673", country: "Brunei", flag: "🇧🇳" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭" },
    { code: "+237", country: "Cameroon", flag: "🇨🇲" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
    { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
    { code: "+235", country: "Chad", flag: "🇹🇩" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+242", country: "Congo", flag: "🇨🇬" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+53", country: "Cuba", flag: "🇨🇺" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+253", country: "Djibouti", flag: "🇩🇯" },
    { code: "+1-767", country: "Dominica", flag: "🇩🇲" },
    { code: "+1-809", country: "Dominican Republic", flag: "🇩🇴" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+291", country: "Eritrea", flag: "🇪🇷" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+679", country: "Fiji", flag: "🇫🇯" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+241", country: "Gabon", flag: "🇬🇦" },
    { code: "+220", country: "Gambia", flag: "🇬🇲" },
    { code: "+995", country: "Georgia", flag: "🇬🇪" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+1-473", country: "Grenada", flag: "🇬🇩" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+224", country: "Guinea", flag: "🇬🇳" },
    { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+592", country: "Guyana", flag: "🇬🇾" },
    { code: "+509", country: "Haiti", flag: "🇭🇹" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+354", country: "Iceland", flag: "🇮🇸" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
    { code: "+1-876", country: "Jamaica", flag: "🇯🇲" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+686", country: "Kiribati", flag: "🇰🇮" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+856", country: "Laos", flag: "🇱🇦" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+266", country: "Lesotho", flag: "🇱🇸" },
    { code: "+231", country: "Liberia", flag: "🇱🇷" },
    { code: "+218", country: "Libya", flag: "🇱🇾" },
    { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+853", country: "Macau", flag: "🇲🇴" },
    { code: "+389", country: "Macedonia", flag: "🇲🇰" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+265", country: "Malawi", flag: "🇲🇼" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+960", country: "Maldives", flag: "🇲🇻" },
    { code: "+223", country: "Mali", flag: "🇲🇱" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
    { code: "+222", country: "Mauritania", flag: "🇲🇷" },
    { code: "+230", country: "Mauritius", flag: "🇲🇺" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+691", country: "Micronesia", flag: "🇫🇲" },
    { code: "+373", country: "Moldova", flag: "🇲🇩" },
    { code: "+377", country: "Monaco", flag: "🇲🇨" },
    { code: "+976", country: "Mongolia", flag: "🇲🇳" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+95", country: "Myanmar", flag: "🇲🇲" },
    { code: "+264", country: "Namibia", flag: "🇳🇦" },
    { code: "+674", country: "Nauru", flag: "🇳🇷" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+227", country: "Niger", flag: "🇳🇪" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+850", country: "North Korea", flag: "🇰🇵" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+680", country: "Palau", flag: "🇵🇼" },
    { code: "+970", country: "Palestine", flag: "🇵🇸" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+1-869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
    { code: "+1-758", country: "Saint Lucia", flag: "🇱🇨" },
    { code: "+1-784", country: "Saint Vincent", flag: "🇻🇨" },
    { code: "+685", country: "Samoa", flag: "🇼🇸" },
    { code: "+378", country: "San Marino", flag: "🇸🇲" },
    { code: "+239", country: "Sao Tome and Principe", flag: "🇸🇹" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+221", country: "Senegal", flag: "🇸🇳" },
    { code: "+381", country: "Serbia", flag: "🇷🇸" },
    { code: "+248", country: "Seychelles", flag: "🇸🇨" },
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+211", country: "South Sudan", flag: "🇸🇸" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+597", country: "Suriname", flag: "🇸🇷" },
    { code: "+268", country: "Swaziland", flag: "🇸🇿" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+228", country: "Togo", flag: "🇹🇬" },
    { code: "+676", country: "Tonga", flag: "🇹🇴" },
    { code: "+1-868", country: "Trinidad and Tobago", flag: "🇹🇹" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
    { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
    { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
    { code: "+39", country: "Vatican City", flag: "🇻🇦" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+967", country: "Yemen", flag: "🇾🇪" },
    { code: "+260", country: "Zambia", flag: "🇿🇲" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  ];

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
                    phone: countryCode + " " + guestPhone,
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
                  response.razorpay_payment_id
              );
            }
          },
          prefill: {
            name: guestName,
            email: guestEmail,
            contact: countryCode + guestPhone,
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
            phone: countryCode + " " + guestPhone,
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
          (error.response?.data?.message || error.message)
      );
    }
  };

  const nextStep = () => {
    if (step === 1 && (!checkIn || !checkOut)) {
      alert("Please select check-in and check-out dates");
      return;
    }
    if (step === 2) {
      if (!guestName || !guestEmail || !guestPhone) {
        alert("Please fill in all guest details");
        return;
      }
      if (!emailVerified) {
        alert("Please verify your email address with OTP");
        return;
      }
      if (!phoneVerified) {
        alert("Please verify your phone number with OTP");
        return;
      }
      setEmailError("");
      setPhoneError("");
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

  const handlePhoneChange = (e) => {
    setGuestPhone(e.target.value);
    setPhoneError("");
    setPhoneVerified(false);
    setPhoneOtpSent(false);
    setPhoneOtpInput("");
    setPhoneOtpError("");
  };

  // Auto-load verified contacts when reaching step 2
  useEffect(() => {
    if (step === 2) {
      API.get("/verify/verified-contacts")
        .then((res) => {
          if (res.data.verifiedEmail) {
            setGuestEmail(res.data.verifiedEmail);
            setEmailVerified(true);
          }
          if (res.data.verifiedPhone) {
            const parts = res.data.verifiedPhone.split(" ");
            if (parts.length >= 2) {
              setCountryCode(parts[0]);
              setGuestPhone(parts.slice(1).join(" "));
            }
            setPhoneVerified(true);
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
      const res = await API.post("/verify/send-email-otp", { email: guestEmail });
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
      await API.post("/verify/verify-email-otp", { email: guestEmail, otp: emailOtpInput });
      setEmailVerified(true);
      setEmailOtpSent(false);
    } catch (err) {
      setEmailOtpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!guestPhone) return;
    const digitsOnly = guestPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setPhoneError("Phone number must contain at least 10 digits");
      return;
    }
    setPhoneSending(true);
    setPhoneOtpError("");
    try {
      const fullPhone = countryCode + " " + guestPhone;
      const res = await API.post("/verify/send-phone-otp", { phone: fullPhone });
      if (res.data.alreadyVerified) {
        setPhoneVerified(true);
      } else {
        setPhoneOtpSent(true);
      }
    } catch (err) {
      setPhoneOtpError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setPhoneSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtpInput) return;
    setPhoneVerifying(true);
    setPhoneOtpError("");
    try {
      const fullPhone = countryCode + " " + guestPhone;
      await API.post("/verify/verify-phone-otp", { phone: fullPhone, otp: phoneOtpInput });
      setPhoneVerified(true);
      setPhoneOtpSent(false);
    } catch (err) {
      setPhoneOtpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setPhoneVerifying(false);
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
                🛏️
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {room.name || room.type}
                </h1>
                <p className="text-xl">₹{room.price} per night</p>
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
                        ₹{room.price}
                      </span>
                    </div>
                    <div className="border-t-2 border-amber-300 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-amber-600">
                          ₹{totalPrice}
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
                        <span className="ml-2 text-green-600">✓ Verified</span>
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
                          {emailSending ? "Sending..." : emailOtpSent ? "Resend" : "Send OTP"}
                        </button>
                      )}
                      {emailVerified && (
                        <button
                          type="button"
                          onClick={() => { setEmailVerified(false); setEmailOtpSent(false); setEmailOtpInput(""); }}
                          className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">{emailError}</p>
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
                          disabled={emailVerifying || emailOtpInput.length !== 6}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                        >
                          {emailVerifying ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    )}
                    {emailOtpError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">{emailOtpError}</p>
                    )}
                  </div>

                  {/* Phone with OTP */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                      {phoneVerified && (
                        <span className="ml-2 text-green-600">✓ Verified</span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => { setCountryCode(e.target.value); setPhoneVerified(false); setPhoneOtpSent(false); }}
                        disabled={phoneVerified}
                        className="border-2 border-gray-300 px-3 py-3 rounded-lg focus:border-amber-500 focus:outline-none bg-white"
                        style={{ minWidth: "140px" }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code + country.country} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={handlePhoneChange}
                        placeholder="98765 43210"
                        disabled={phoneVerified}
                        className={`flex-1 border-2 px-4 py-3 rounded-lg focus:outline-none ${
                          phoneVerified
                            ? "border-green-500 bg-green-50 text-green-800"
                            : phoneError
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        required
                      />
                      {!phoneVerified && (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          disabled={phoneSending || !guestPhone}
                          className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {phoneSending ? "Sending..." : phoneOtpSent ? "Resend" : "Send OTP"}
                        </button>
                      )}
                      {phoneVerified && (
                        <button
                          type="button"
                          onClick={() => { setPhoneVerified(false); setPhoneOtpSent(false); setPhoneOtpInput(""); }}
                          className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">{phoneError}</p>
                    )}
                    {phoneOtpSent && !phoneVerified && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={phoneOtpInput}
                          onChange={(e) => setPhoneOtpInput(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1 border-2 border-amber-400 px-4 py-2 rounded-lg focus:border-amber-600 focus:outline-none tracking-widest text-center text-lg font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPhoneOtp}
                          disabled={phoneVerifying || phoneOtpInput.length !== 6}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                        >
                          {phoneVerifying ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    )}
                    {phoneOtpError && (
                      <p className="mt-1 text-sm text-red-600 font-semibold">{phoneOtpError}</p>
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
                    disabled={!emailVerified || !phoneVerified || !guestName}
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
                    <span className="text-2xl">💳</span>
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
                    <span className="text-2xl">💵</span>
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
                        ₹{totalPrice}
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
                    Confirm & Pay ₹{totalPrice}
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

// Email template utility
const createEmailTemplate = (type, data) => {
  const templates = {
    verification: (otp) => `
      <h1>Email Verification</h1>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
    bookingConfirmation: (bookingDetails) => `
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking with us!</p>
      <p>Room: ${bookingDetails.roomName}</p>
      <p>Check-in: ${bookingDetails.checkIn}</p>
      <p>Check-out: ${bookingDetails.checkOut}</p>
      <p>Total: ₹${bookingDetails.total}</p>
    `,
    paymentReceipt: (paymentDetails) => `
      <h1>Payment Receipt</h1>
      <p>Payment confirmed!</p>
      <p>Amount: ₹${paymentDetails.amount}</p>
      <p>Transaction ID: ${paymentDetails.transactionId}</p>
      <p>Date: ${paymentDetails.date}</p>
    `,
  };

  return templates[type] ? templates[type](data) : '';
};

module.exports = createEmailTemplate;

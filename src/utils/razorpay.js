// src/utils/razorpay.js
export const loadRazorpay = async (food) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Test key for now
    amount: food.price * 100, // Convert to paise
    currency: "INR",
    name: "FoodShare",
    description: `Buying ${food.title}`,
    image: "/logo.png",
   handler: function (response) {
  console.log("Razorpay Response:", response);
  alert(`Payment Successful ✅\nPayment ID: ${response.razorpay_payment_id}`);
},

    prefill: {
      name: food.buyerName || "Test User",
      email: "test@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "FoodShare HQ",
    },
    theme: {
      color: "#FACC15",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

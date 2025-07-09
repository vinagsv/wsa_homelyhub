import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  selectPaymentDetails,
  selectPaymentStatus,
} from "../../store/payment/payment-slice";
import {
  verifyPayment,
  initialCheckoutSession,
} from "../../store/payment/payment-action";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useSelector((state) => state.user);

  const {
    checkinDate,
    checkoutDate,
    totalPrice: totalAmount,
    propertyName,
    guests,
    nights,
  } = useSelector(selectPaymentDetails);

  const { loading, error, orderData } = useSelector(selectPaymentStatus);

  const loadRazorPayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    try {
      const isLoaded = await loadRazorPayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }
      dispatch(
        initialCheckoutSession({
          amount: totalAmount,
          currency: "INR",
          propertyId,
          fromDate: checkinDate,
          toDate: checkoutDate,
          guests,
        })
      );
    } catch (error) {
      console.log("Error in Checkout payment", error.message);
    }
  };

  useEffect(() => {
    if (!orderData) return;

    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: "Homely Hub",
      description: `Booking for ${propertyName}`,
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          await dispatch(
            verifyPayment({
              razorpayData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              bookingDetails: {
                propertyId,
                fromDate: checkinDate,
                toDate: checkoutDate,
                guests,
                totalAmount,
              },
            })
          );
          toast.success("Booking confirmed! Redirecting...");
          navigate("/user/mybookings");
        } catch (error) {
          toast.error("Payment verification failed");
          navigate("/");
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      notes: {
        property_id: propertyId,
        property_name: propertyName,
      },
      theme: {
        color: "#FF5A5F",
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }, [
    orderData,
    dispatch,
    navigate,
    propertyName,
    checkinDate,
    checkoutDate,
    guests,
    totalAmount,
    propertyId,
    user,
  ]);

  return (
    <div className="booking-container">
      <div className="property-details">
        <h2>{propertyName}</h2>
        <p>Rs. {totalAmount}</p>
      </div>

      <div className="booking-form">
        <div className="form-group">
          <label>Check-in Date:</label>
          <input type="date" value={checkinDate} disabled />
        </div>

        <div className="form-group">
          <label>Check-out Date:</label>
          <input type="date" value={checkoutDate} disabled />
        </div>

        <div className="form-group">
          <label>Number of Guests:</label>
          <input type="number" value={guests} disabled />
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Total Amount: Rs. {totalAmount}</p>
          <p>Number of nights: {nights}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleBooking}
          disabled={loading}
          className="book-now-btn"
        >
          {loading ? "Processing..." : `Book Now - Rs. ${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;

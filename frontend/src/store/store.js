import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Users/user-slice";
import propertySlice from "./Property/property-slice";
import PropertyDetailsSlice from "./PropertyDetails/PropertyDetails-slice";
import paymentSlice from "./payment/payment-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    properties: propertySlice.reducer,
    propertydetails: PropertyDetailsSlice.reducer,
    payment: paymentSlice.reducer,
  },
});

export default store;

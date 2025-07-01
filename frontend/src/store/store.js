import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Users/user-slice";
import propertySlice from "./property/property-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    properties: propertySlice.reducer,
  },
});

export default store;

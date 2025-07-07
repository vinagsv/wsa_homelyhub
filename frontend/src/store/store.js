import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Users/user-slice";
import propertySlice from "./Property/property-slice";
import PropertyDetailsSlice from "./PropertyDetails/PropertyDetails-slice";

const store = configureStore({
    reducer:{
        user:userSlice.reducer,
        properties:propertySlice.reducer,
        propertydetails: PropertyDetailsSlice.reducer,
    },
});

export default store
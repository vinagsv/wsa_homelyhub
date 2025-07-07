import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";
import Accomodation from "./components/accomodation/Accomodation";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import MyBookings from "./components/mybookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/Users/user-slice";
import { useEffect } from "react";
import { CurrentUser } from "./store/Users/user-action";
import AccomodationForm from "./components/accomodation/AccomodationForm";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";

function App() {
  const dispatch = useDispatch()
  const {errors} = useSelector((state)=>state.user);

  useEffect(() => {
    if (errors){
      dispatch(userActions.clearError());
    }
  }, [errors,dispatch])

  useEffect(() => {
    dispatch(CurrentUser())
  }, []);
  
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="*" element={<Main />} id="main" exact>
        <Route id="home" index element={<PropertyList />} />
        <Route
          element={<PropertyListing />}
          id="propertyListing"
          path="propertylist/:id"
          exact
        />
        {/* Login */}
        <Route id="login" path="login" element={<Login />} />
        <Route id="signup" path="signup" element={<Signup />} />
        <Route id="profile" path="profile" element={<Profile />} />
        <Route id="editprofile" path="editprofile" element={<EditProfile />} />
        {/* accomendation */}
        <Route
          id="accomodation"
          path="accomodation"
          element={<Accomodation />}
        />
        <Route
           id="accommodation-form"
           path="accommodation-form"
           element={<AccomodationForm />}
        />

        <Route
           id="forgotpassword"
           path="user/forgotpassword"
           element={<ForgetPassword/>}
        />

        <Route
           id="resetpassword"
           path="user/resetpassword/:token"
           element={<ResetPassword/>}
        />

        <Route
           id="updatepassword"
           path="user/updatepassword"
           element={<UpdatePassword/>}
        />

        <Route
          id="mybookings"
          path="user/mybookings"
          element={<MyBookings />}
        />
        <Route
          id="bookingdetails"
          path="user/mybookings/bookingdetails"
          element={<BookingDetails />}
        />
      </Route>
    )
  );
  return (
    <div className="App">
      {/* <Home /> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

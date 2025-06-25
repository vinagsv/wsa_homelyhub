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
import { useEffect } from "react";
import { userActions } from "./store/Users/user-slice";
import { currentUser } from "./store/Users/user-action";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const { errors } = useSelector((state) => state.user);

  useEffect(() => {
    if (errors) {
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  useEffect(() => {
    dispatch(currentUser());
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="*" element={<Main />} id="main" exact>
        <Route id="home" index element={<PropertyList />} />
        <Route
          element={<PropertyListing />}
          id="propertyListing"
          path="propertylist"
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

import React, { Fragment } from "react";
import ProgressSteps from "../ProgressSteps";
import { Link } from "react-router-dom";
import "../../CSS/Profile.css";
import { useSelector } from "react-redux";
import LoadingSpinner from "../Loadingspinner";
import moment from "moment";

const Profile = () => {
const {user,loading} = useSelector((state)=>state.user);
  return (
    <>
      <ProgressSteps profile />

      <div className="row justify-content-around mt-5 ">
        {loading && <LoadingSpinner/>}
        {user && !loading &&(
        <div className="col-6 col-md-6 profile">
          <div className="avatars">
            <figure className="avatar-profile text-center mr-2">
              <img
                className="rounded-circle figure-img img-fluid"
                src={user.avatar.url}
                alt="avatar"
              />
            </figure>
            <h3>Welcome{user.name}</h3>
          </div>
          <div className="userinfo">
            <h4>Full Name</h4>
            <p>{user.name}</p>

            <h4>Email Address</h4>
            <p>{user.email}</p>

            <h4>Joined On</h4>
            <p>{moment(user.createdAt).format("Do MMMM YYYY")}</p>

            <div className="buttons">
              <Link
                to="/editprofile"
                id="edit_profile"
                className="btn btn-block my-5"
              >
                Edit Profile
              </Link>
              <Link to="/user/updatePassword" className="btn btn-block my-5 mx-4">
                Change Password
              </Link>
            </div>
          </div>
        </div>
         )}
      </div>
    </>
  );
};

export default Profile;

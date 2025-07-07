import React, { useEffect } from "react";
import "../../CSS/PropertyListing.css";
import "../../CSS/PropertyListing.css";
import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPropertyDetails } from "../../store/PropertyDetails/PropertyDetails-action";
import PropertyMapInfo from "./PropertyMapInfo";
// import { getPropertyList } from "../../Store/PropertyListing/propertylist-action";

const PropertyListing = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const { loading, propertydetails } = useSelector(
    (state) => state.propertydetails
  );

  console.log("propertyDetails", propertydetails);
  console.log(id);

  useEffect(()=>{
    dispatch(getPropertyDetails(id));
  },[dispatch,id]);

  if (loading || !propertydetails || !propertydetails.address) {
    return <div className="loader">Loading property details...</div>;
  }

  const {propertyName,address,description,images,amenities,maximumGuest,price,currentBookings} = propertydetails;


  return (
    <div className="property-container">
      <p className="property-header" >
       {propertyName}
      </p>
      <h6 className="property-location">
        <span className="material-symbols-outlined">house</span>
        <span className="location"> {`${address.area}, ${address.city}, ${address.state} - ${address.pincode}`}</span>
      </h6>
      <PropertyImg images={images} />
      <div className="middle-container row">
        <div className="des-and-amenities col-md-8 col-sm-12 col-12">
          <h2 className="property-description-header">Description</h2>
          <p className="property-description">
            {description} <br></br>
            <br></br>Max number of guests:{maximumGuest}
          </p>
          <hr></hr>
          <PropertyAmenities amenities={amenities} />
        </div>
        <div className="property-payment col-md-4 col-sm-12 col-12">
          <PaymentForm />
        </div>
      </div>
      <hr></hr>
      <div className="property-map">
        <div className="map-image-exinfo-container row">
          <PropertyMapInfo address={address}/>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;

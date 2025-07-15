import React from "react";

const AddressField = ({ form }) => {
  return (
    <div className="address-container ">
      <h4 className="address-header">Address</h4>
      <label className="form-labels">Address to your place</label>
      <br></br>
      <div className="address-fields">
        <form.Field name="address.area">
          {(field) => (
            <input
              className="area"
              type="text"
              placeholder="Area"
              required
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="address.city">
          {(field) => (
            <input
              className="city"
              type="text"
              placeholder="city"
              required
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="address.state">
          {(field) => (
            <input
              className="state"
              type="text"
              placeholder="state"
              required
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="address.pincode">
          {(field) => (
            <input
              className="pincode"
              type="text"
              placeholder="pincode"
              required
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
};

export default AddressField;

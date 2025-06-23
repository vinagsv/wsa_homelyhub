import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body();

    const uploadImages = [];

    for (const image of images) {
      const result = await imagekit.upload({
        file: image.url,
        fileName: `property_${Date.now()}.jpg`,
        folder: "property_images",
      });
      uploadImages.push({ url: result.url, public_id: result.fileId });
    }
    const newProperty = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images: uploadImages,
      userId: req.user.id,
    });

    res.status(200).json({ status: "success", data: { data: newProperty } });
  } catch (error) {
    console.log("Error in fetching the data");
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const allProperties = await Property.find();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      no_of_responses: doc.length,
      all_properties: allProperties.length,
      data: doc,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ status: "fail", error: "Internal server Error" });
  }
};

const getUserProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const property = await Property.find({ userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.error("Error Fetching your properties", error);
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

export { getProperty, createProperty, getProperties, getUserProperties };

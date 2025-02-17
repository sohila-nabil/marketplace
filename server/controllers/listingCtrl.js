import Listing from "../models/listingModel.js";
import { v2 } from "cloudinary";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";

const createListing = async (req, res, next) => {
  const { ...data } = req.body;
  const images = req?.files?.images;
  console.log(data);
  console.log(images);

  try {
    let imagesUrl = [];
    if (images && images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (img) => {
          const cloudRes = await v2.uploader.upload(img.tempFilePath);
          if (!cloudRes || cloudRes.error) {
            console.error(
              "Cloudinary Error",
              cloudRes.error || "untoken cloudainary error"
            );
            return next(errorHandler(500, "Error uploading to Cloudinary"));
          }
          return { public_id: cloudRes.public_id, url: cloudRes.url };
        })
      );
    }
    const listing = await Listing.create({ ...data, images: imagesUrl });
    await listing.save();
    res
      .status(200)
      .json({ success: true, msg: "Listing Creating Successfully", listing });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getOneListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
    });
    if (!listing)
      return next(errorHandler(400, "specified listing not found "));
    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const { ...data } = req.body;
  const images = req.files?.images;
  console.log("images", images);

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(400, "Listing not found"));

    // Fix: Convert listing.user (ObjectId) to string before comparison
    if (listing.user.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to update this listing")
      );
    }

    let updatedImages = [...listing.images];

    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      const uploadedImages = await Promise.all(
        imageArray.map(async (img) => {
          const cloudRes = await v2.uploader.upload(img.tempFilePath);
          if (!cloudRes || cloudRes.error) {
            return next(errorHandler(400, "Error uploading to Cloudinary"));
          }
          return { public_id: cloudRes.public_id, url: cloudRes.url };
        })
      );

      updatedImages = [...updatedImages, ...uploadedImages];
      console.log("updatedImages", updatedImages);
    }

    // Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...data, images: updatedImages },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error in updateListing:", error);
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    let searchTerm = req.query.searchTerm || "";
    let sort = req.query.sort || "createdAt";
    let order = req.query.order || "desc";

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      type,
      furnished,
      parking,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json( listings );
  } catch (error) {
    next(error);
  }
};

const deleteOneImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  console.log("Received imageId:", imageId); // Debugging step

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(400, "listing not found"));
    let imageExists = listing.images.some((img) => img.public_id === imageId);
    if (!imageExists) {
      return next(errorHandler(400, "Image not found in listing"));
    }
    await v2.uploader.destroy(imageId);
    listing.images = listing.images.filter((img) => img.public_id !== imageId);
    await listing.save();
    res
      .status(200)
      .json({ success: true, message: "image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(400, "listing not found"));
    if (listing.user.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to delete this listing")
      );
    }
    if (listing.images && listing.images.length > 0) {
      await Promise.all(
        listing.images.map((img) => v2.uploader.destroy(img.public_id))
      );
    }
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  createListing,
  deleteListing,
  deleteOneImage,
  updateListing,
  getOneListing,
  getListings,
};

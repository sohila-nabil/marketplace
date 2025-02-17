import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { v2 } from "cloudinary";
import bcrypt from "bcrypt";
import Listing from "../models/listingModel.js";

const updateUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const photo = req?.files?.photo;
  const { id } = req.user;

  try {
    if (id !== req.params.id)
      return next(errorHandler(400, "sorry you cant update this data"));
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(400, "user not found"));
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }
    if (photo) {
      if (user.avatar.public_id) {
        await v2.uploader.destroy(user.avatar.public_id);
      }
      const cloudRes = await v2.uploader.upload(photo.tempFilePath);
      if (!cloudRes || cloudRes.error) {
        console.error(
          "Cloudinary Error",
          cloudRes.error || "untoken cloudainary error"
        );
        return next(errorHandler(500, "Error uploading to Cloudinary"));
      }
      user.avatar = { public_id: cloudRes.public_id, url: cloudRes.url };
    }

    await user.save();
    const { password: pass, ...data } = user._doc;
    res
      .status(200)
      .json({ success: true, message: "Data updated Successfully", data });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    if (id !== req.params.id)
      return next(errorHandler(400, "you cant delete this user"));
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(errorHandler(400, "yser not found"));
    if (user.avatar.public_id) {
      await v2.uploader.destroy(user.avatar.public_id);
    }
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const userListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(400, "you cant see this listings"));
  }
  try {
    const listings = await Listing.find({ user: req.params.id });
    if (!listings || listings.length <= 0) {
      return next(errorHandler(400, "no listings existed"));
    }
    res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(400, "user not found"));
    const { password: pass, ...data } = user._doc;
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export { updateUser, deleteUser, userListings, getUser };

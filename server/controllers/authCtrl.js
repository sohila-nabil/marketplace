import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { v2 } from "cloudinary";

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  let photo = req.files.photo;
  try {
    let hashedPassword = bcrypt.hashSync(password, 10);
    const cloudRes = await v2.uploader.upload(photo.tempFilePath);
    if (!cloudRes || cloudRes.error) {
      console.error(
        "Cloudinary Error",
        cloudRes.error || "untoken cloudainary error"
      );
      return next(errorHandler(500, "Error uploading to Cloudinary"));
    }
    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar: { public_id: cloudRes.public_id, url: cloudRes.url },
    });
    await user.save();
    res
      .status(200)
      .json({ sucess: true, message: "User registered Successfully" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) return next(errorHandler(404, "user not exist"));
    const validPassword = bcrypt.compareSync(password, existUser.password);
    if (!validPassword)
      return next(errorHandler(401, "invalid password or email"));
    const { password: pass, ...data } = existUser._doc;
    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET);
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, message: "logged in successfully", data });
  } catch (error) {
    next(error);
  }
};

const signWithGoogle = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...data } = user._doc;
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, message: "logged in successfully", data });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const randomName =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: randomName,
        email,
        password: hashedPassword,
        avatar: {
          public_id:'',
          url:photo
        },
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...data } = newUser._doc;
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, message: "registered  successfully", data });
    }
  } catch (error) {
    next(error);
  }
};

const signout = async(req,res,next)=>{
  try {
    res.clearCookie('token')
    res.status(200).json({success:true,message:"Logged out successfully"})
  } catch (error) {
    next(error)
  }
}

export { signup, signin, signWithGoogle, signout };

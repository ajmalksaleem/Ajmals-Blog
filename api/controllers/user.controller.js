import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const UpdateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update this user"));
  }
  try {
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(
        errorHandler(401, "username must be between 5 and 20 charectors")
      );
    }
    if (req.body.username.includes(" ")){
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()){
      return next(errorHandler(400, "username must be in lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "username must contain only letters and numbers")
      );
    }
    const existingUsername = await User.findOne({ username:req.body.username });
    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return next(errorHandler(400, "Username Already Exists"));
    }
  }
  if(req.body.email){
    const existingEmail = await User.findOne({ email:req.body.email });
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return next(errorHandler(400, "Email-Id already exists"));
    }
  }
  if (req.body.password) {
    if (req.body.password.length < 5){
      return next(
        errorHandler(401, "password should be greater than 5 charectors")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
    const UpdatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = UpdatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const DeleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId.toString())
    return next(errorHandler(401, "You can only delete your own account"));
  try {
  const finduser = await User.findById(req.params.userId) 
  if(req.user.isAdmin && finduser.isAdmin && (req.user.id !== req.params.userId.toString())){
    return next(errorHandler(400, "Admin account cant be deleted by other admins"))
  }
    await User.findByIdAndDelete(req.params.userId);
    if (req.user.id === req.params.userId) res.clearCookie("access_token");
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    next(error);
  }
};

export const SignOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("user has been signed out");
  } catch (error) {
    next(error);
  }
};

export const GetUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ updatedAt: sortDirection })
      .select("-password")
      .skip(startIndex)
      .limit(limit);
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const CheckDuplicate = async (req, res, next) => {
  try {
    const username = req.body?.username;
    const email = req.body?.email;

    if (username) {
      const findUserByUsername = await User.findOne({ username });
      if (findUserByUsername) {
        return next(errorHandler(400, "Username-exists"));
      }
    }

    if (email) {
      const findUserByEmail = await User.findOne({ email });
      if (findUserByEmail) {
        return next(errorHandler(400, "Email-exists"));
      }
    }
    res.status(200).json("no duplicates");
  } catch (error) {
    next(error);
  }
};

export const CheckUpdateDuplicate = async (req, res, next) => {
  const { username, email } = req.body;
  if (!username || !email) return;
  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return next(errorHandler(400, "Username-exists"));
    }
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return next(errorHandler(400, "Email-exists"));
    }
    res.status(200).json("no duplicates");
  } catch (error) {
    next(error);
  }
};

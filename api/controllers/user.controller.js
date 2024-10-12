import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const UpdateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 4)
      return next(
        errorHandler(401, "password should be greater than 4 charectors")
      );
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 4 || req.body.username.length > 10) {
      return next(
        errorHandler(401, "username must be between 4 and 10 charectors")
      );
    }
    if (req.body.username.includes(" "))
      return next(errorHandler(400, "Username cannot contain spaces"));
    if (req.body.username !== req.body.username.toLowerCase())
      return next(errorHandler(400, "username must be in lowercase"));
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "username must contain only letters and numbers")
      );
    }
  }
  try {
      const UpdatedUser = await User.findByIdAndUpdate(req.params.userId,{
          $set : {
              username : req.body.username,
              email : req.body.email,
              password : req.body.password,
              profilePicture : req.body.profilePicture
          }
      },{new:true});
      const {password,...rest} = UpdatedUser._doc;
      res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
};

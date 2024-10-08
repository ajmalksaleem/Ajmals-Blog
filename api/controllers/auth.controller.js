import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All field required"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("user created succesfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All field required"));
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) return next(errorHandler(400, "User not found"));
    const validdatePassword = bcryptjs.compareSync(
      password,
      foundUser.password
    );
    if (!validdatePassword)
      return next(errorHandler(401, "Password or Email is incorrect"));
    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "1d",
    });
    res.status(200).cookie('access_token',token, {httpOnly: true})
    const {password:pass, ...rest} = foundUser._doc
    res.json(rest)
  } catch (error) {
    next(error);
  }
};

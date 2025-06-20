import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import imagekit from "../utils/imagekitIO.js";
import { promisify } from "util";

const defaultAvatarUrl = "https://i.pravatar.cc/150?img=15";

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signinToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};

const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: { url: req.body.avatar || defaultAvatarUrl },
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password");
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 100),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ status: "Success", message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ status: "Fail", message: error.message });
  }
};

const protect = async (req, res, next) => {
  try {
    // 1.getting the token and check if its there or not
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Bearer
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error("You are not logged in! Please login.");
    }
    // 2.verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3.check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("the user belonging to the token, doesnt exists");
    }
    // 4.check if the user have changed the passwors after the token has been issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
      throw new Error("user recently changed the password,Please login again");
    }
    // 5.grant access to protected Routes
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, "name", "phoneNumber", "avatar");
    if (req.body.avatar !== undefined) {
      const base64Data = req.data.avatar;
      const uploadResponse = await imagekit.upload({
        file: base64Data,
        _filename: `avatar_${Date.now()}.jpg`,
        folder: "avatar",
        transformation: [{ width: "150", height: "150", crop: "scale" }],
      });

      filteredBody.avatar = {
        public_id: iploadResponse.feildId,
        url: uploadResponse.url,
      };
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      message: error.message,
    });
  }
};

export { signup, login, logout, protect, updateMe };

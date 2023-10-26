import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../mongodb/models/user/user.js";

// @route POST /auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = await User.findOne({ userName }).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          userName: user.userName,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err)
  }
};

// @route POST /auth/user-infor
// @access Public
const getMe = async (req, res) => {
  try {
    const id = req.id;

    const inforUser = await User.findById(id)
      .populate("address")
      .select("-password")
      .lean();

    return res.status(200).json(inforUser);
  } catch (err) {
    console.log(err)
  }
};

// @route POST /auth/refresh
// @access Public
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbiden" });

        const user = await User.findById(decoded.id).lean();

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: user._id,
              userName: user.userName,
              role: user.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30m" }
        );

        return res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err)
  }
};

// @route POST /auth/logout
// @access Public
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res.json({ message: "Cookie cleared" });
  } catch (err) {
    console.log(err)
  }
};

export { login, getMe, refreshToken, logout };

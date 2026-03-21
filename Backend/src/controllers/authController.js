import bcrypt from "bcrypt";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    // console.log("New User: ", newUser);
    await newUser.save();
    res.status(201).json({ message: "user registred successfully" });
  } catch (error) {
    // console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Error in registering the user",
    });
  }
};
export const login = async (req, res) => {
  console.log("The authenticated user is :", req.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user" });
  }
  req.logout((err) => {
    if (err) return res.status(400).json({ message: "User not logged in" });
  });
  res.status(200).json({ message: "Logout successful " });
};

// 2FA
export const setup2FA = async (req, res) => {
  try {
    console.log("the req.user is :", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("The secret object is :", secret);
    user.twoFactorSecert = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.nikhiltelukuntla.com",
      encoding: "base32",
    });
    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
      qrCode: qrImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Error in setting up 2FA", message: error });
  }
};

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecert,
    encoding: "base32",
    token,
  });
  if (verified) {
    const jwtToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      },
    );
    res.status(200).json({ message: "2FA successFull", token: jwtToken });
  } else {
    res.status(400).json({ message: "Invalid 2FA token" });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecert = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error in resetting 2FA", message: error });
  }
};

import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

// user registration

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        password,
      )
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// user login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });
   
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      config.jwtRefreshSecret,
      { expiresIn: "7d" },
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const accessToken = jwt.sign(
      { id: existingUser._id },
      config.jwtAccessSecret,
      { expiresIn: "1h" },
    );
    
    return res
      .status(200)
      .json({ message: "Login successful", accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

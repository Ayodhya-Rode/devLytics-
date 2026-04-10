import express from "express";
import { registerUser, loginUser } from "../controllers/authUser.controller.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Object} 200 - User created successfully
 * @returns {Object} 400 - User creation failed
 */

router.post("/register", registerUser);


/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Object} 200 - Login successful
 * @returns {Object} 400 - Login failed
 */
router.post("/login", loginUser);

export default router;

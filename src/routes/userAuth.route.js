import express from "express";
import { registerUser } from "../controllers/authUser.controller.js";

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


export default router;

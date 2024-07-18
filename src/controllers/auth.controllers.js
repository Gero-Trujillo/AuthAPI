import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { SECRET_KEY } from "../config.js";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [rowsCount] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      email
    );
    if (rowsCount.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [rows] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?,?,?)",
      [username, email, passwordHash]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email =?",
      email
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = await createAccessToken({
      id: rows[0].id,
      username: rows[0].username,
      email: rows[0].email,
    });
    res.cookie("access_token", token);
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("access_token").json({ message: "Logged out successfully" });
};

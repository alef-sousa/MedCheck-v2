import express from "express";
import {
  getAllUsers,
  createUser,
  loginUser
} from "../controllers/usersController.js";

const router = express.Router();
// GET todos os usuários
router.get("/", getAllUsers);

// POST criar usuário
router.post("/", createUser);

// POST login
router.post("/login", loginUser);

export default router;

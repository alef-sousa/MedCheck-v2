import express from "express";
import {
    getAllUsers,
    createUser,
    loginUser
} from "../controllers/usersController.js";

export const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/login", loginUser);

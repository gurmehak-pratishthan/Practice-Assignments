import { Router } from "express";
const router = Router();
import { v4 as uuid} from "uuid";
import {createUser, getAllUsers, getUserById, deleteUser, updateUser}from "../controllers/UserController.js";


// Get all users
router.get("/", getAllUsers);

//Get user by id
router.get("/:id", getUserById);

// Create a new user
router.post("/", createUser);

//Delete a user
router.delete("/:id", deleteUser);

//Update a user
router.patch("/:id", updateUser);

export default router;
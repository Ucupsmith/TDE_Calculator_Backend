import { getUserById, createUser } from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const userId = await createUser(username, password, email);
    res.status(201).json({ message: "User created", userId });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

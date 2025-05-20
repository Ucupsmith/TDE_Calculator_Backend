import { getUserById, createUser } from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ 
      message: "Error retrieving user", 
      error: error.message 
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ 
        message: "Username, password, and email are required" 
      });
    }

    const userId = await createUser(username, password, email);
    res.status(201).json({ 
      message: "User created successfully", 
      userId 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      message: "Error creating user", 
      error: error.message 
    });
  }
};

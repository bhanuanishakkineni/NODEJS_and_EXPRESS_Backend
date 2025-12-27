import { error } from "console";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  // res.json({message: 'User registration endpoint'});
  const { name, email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await prisma.user.findUnique({
    where: { email: lowerCaseEmail },
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: lowerCaseEmail,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: lowerCaseEmail }
  });

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate token
  const token = generateToken(user.id, res);

  // Send response with token

  res.status(200).json({
    status: "success",
    data: {
      user: {
        name: user.name
      }
    },
    token: token
  })

};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ 
    status: "success",
    message: "Logged out successfully" 
  }); 
}

export { registerUser, login, logout };

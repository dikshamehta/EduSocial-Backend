import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID);

/* REGISTER */
export const register = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends
        } = req.body;

        const salt = await bcrypt.genSalt(10); //Used to encrypt password
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            firstName,
            lastName,
            email,
            password: passwordHash, //passwordHash is the encrypted password
            picturePath,
            friends
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //json version of savedUser
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGIN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; //Deconstructing email and password from req.body (when user tries to login)
        const user = await User.findOne({ email: email});
        if (!user) return res.status(400).json({ msg: "User not found."}); //Validates if email exists and is inputted correctly

        const isMatch = await bcrypt.compare(password, user.password); //Compare the password entered with the encrypted password in the database
        if (!isMatch) return res.status(400).json({ msg: "Invalid password."}); //Validates if password is correct

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //Creates a token to keep user logged in
        //Signed with user id, passing in secret string
        delete user.password;
        res.status(200).json({ token, user}); //NOTE: THIS IS A BASIC SETUP (Real companies use 3rd party or a team to manage security)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "469990524586-h4jaoor34r3eh22t2m43cm4pklf1btsh.apps.googleusercontent.com",
    });


    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Create a new user if one doesn't exist
      user = new User({
        username: payload.email, // Or generate a username based on the email
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        // You might not want to store a password for OAuth users
        // or have a separate strategy for OAuth users.
        password: payload.email + payload.lastName,
        picturePath: payload.imageUrl,
        googleId: payload.sub,
        picturePath: payload.imageUrl,
        // Initialize other fields as necessary
      });
      await user.save();
      
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Exclude sensitive data before sending the user info
    const { password, ...userData } = user._doc;

    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
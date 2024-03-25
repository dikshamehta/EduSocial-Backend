import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const googleOAuthLogin = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request data

  const { userProfile } = req.body;
  //   const { email, displayName, photoURL, uid } = req.body;
  const { email, displayName, photoURL, uid, token } = userProfile;
  const names = displayName.split(" ");
  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

  try {
    let user = await User.findOne({ email });

    if (user) {
      console.log("User exists");
      user.picturePath = photoURL || user.picturePath;
      await user.save();
    } else {
      console.log("Creating new user");
      user = new User({
        username: email,
        firstName, // Make sure this is a defined string
        lastName, // Make sure this is a defined string
        email,
        password: uid, // Caution with using uid as password, consider security implications
        picturePath: photoURL,
      });
      await user.save();
      console.log("New user saved");
    }

    // Check if the JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("Token generated");

    const userToSend = user.toObject();
    delete userToSend.password; // Make sure to not send the password back

    res.status(200).json({ success: true, token, user: userToSend });
  } catch (error) {
    console.error("Error in googleOAuthLogin:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

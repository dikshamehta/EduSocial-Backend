import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { createAd } from "./controllers/ad.js";
import { verifyToken } from "./middleware/auth.js";
import { changeSettings } from "./controllers/users.js";






/* CONFIGURATIONS - Middleware */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //Sets directory for where we keep assets - the images we store. We store LOCALLY here but want to store in the cloud


/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); //register is the controller function
//This path is what you call from front end if someone wants to register
//need upload and is why this is different from the other routes
app.post("/posts", verifyToken, upload.single("file"), createPost); //createPost is the controller function
//Calls the upload above to upload the media

app.post("/ads", verifyToken, upload.single("picture"), createAd); //createAd is the controller function

/* ROUTES */
app.use("/auth", authRoutes); //e.g., localhost:5000/auth/login
app.use("/user", userRoutes); //e.g., localhost:5000/user/friends (3 user routes)
app.use("/posts", postRoutes); //e.g., localhost:5000/posts (4 post routes)

// app.put("user/:id/changeSettings", verifyToken, changeSettings); //Change user settings by their ID



app.get("/", (req, res) => {
  res.send("Hello to EduSocial API");
});

/* DATABASE MONGOOSE SETUP */
const port = process.env.PORT || 5000;
// mongoose.set("useFindAndModify", true);
// mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(port, () => console.log(`Server running on port: ${port}`));
}).catch((err) => console.log(`${err} did not connect`));
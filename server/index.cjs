Promise.all([
  import("express"),
  import("body-parser"),
  import("cors"),
  import("dotenv"),
  import("multer"),
  import("helmet"),
  import("morgan"),
  import("path"),
  import("url"),
  import("mongoose"),
  import("./controllers/auth.js"),
  import("./routes/auth.js"),
  import("./routes/users.js"),
  import("./routes/posts.js"),
  import("./routes/polls.js"),
  import("./routes/search.js"),
  import("./routes/pages.js"),
  import("./routes/pagePosts.js"),
  import("./controllers/posts.js"),
  import("./controllers/ad.js"),
  import("./middleware/auth.js"),
  import("./controllers/pages.js"),
  import("./controllers/pagePosts.js")
]).then(([
  express,
  bodyParser,
  cors,
  dotenv,
  multer,
  helmet,
  morgan,
  path,
  url,
  mongoose,
  authController,
  authRoutes,
  userRoutes,
  postRoutes,
  pollRoutes,
  searchRoutes,
  pageRoutes,
  pagePostRoutes,
  postController,
  adController,
  authMiddleware,
  pageController,
  pagePostController
]) => {
  const app = express.default();
  dotenv.default.config();

  // Middleware setup
  app.use(express.default.json());
  app.use(helmet.default());
  app.use(helmet.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan.default("common"));
  app.use(bodyParser.default.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.default.urlencoded({ limit: "30mb", extended: true }));
  app.use(cors.default());
  app.use("/assets", express.default.static(path.default.join(__dirname, "public/assets")));

  // File storage setup
  const storage = multer.default.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "public/assets");
      },
      filename: (req, file, cb) => {
          cb(null, file.originalname);
      },
  });
  const upload = multer.default({ storage });

  // Routes with files
  app.post("/auth/register", upload.single("picture"), authController.register);
  app.post("/posts", authMiddleware.verifyToken, upload.single("file"), postController.createPost);
  app.post("/page/create", upload.single("pagePictureFile"), pageController.createPage);
  app.post("/pagePost", authMiddleware.verifyToken, upload.single("file"), pagePostController.createPagePost);
  app.post("/page/:pageId", authMiddleware.verifyToken, upload.single("pagePictureFile"), pageController.updatePage);
  app.post("/ads", authMiddleware.verifyToken, upload.single("picture"), adController.createAd);

  // Routes
  app.use("/auth", authRoutes.default); // Note: Using `.default` to access the exported router
  app.use("/user", userRoutes.default);
  app.use("/posts", postRoutes.default);
  app.use("/polls", pollRoutes.default);
  app.use("/search", searchRoutes.default);
  app.use("/page", pageRoutes.default);
  app.use("/pagePost", pagePostRoutes.default);

  app.get("/", (req, res) => {
      res.send("Hello to EduSocial API");
  });

  // Database setup
  const port = process.env.PORT || 5000;
  console.log("Connecting to MongoDB... " + process.env.PORT);
  mongoose.default.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  }).then(() => {
      app.listen(port, () => console.log(`Server running on port: ${port}`));
  }).catch((err) => console.log(`${err} did not connect`));
}).catch(error => {
  console.error("Error importing modules:", error);
});

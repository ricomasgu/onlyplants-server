const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const fileUploaderRoutes = require("./routes/fileUploader.routes");
app.use("/", fileUploaderRoutes);

module.exports = router;

const router = require("express").Router();

router.get("/", (_, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const authRoutes = require("./auth.routes");
router.use('/auth', authRoutes);

/* const fileUploaderRoutes = require("./fileUploader.routes");
router.use("/", fileUploaderRoutes); */

module.exports = router;
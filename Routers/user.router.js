const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../Controllers/users.controller");

const app = express();
app.use(bodyParser.json());
const router = express.Router();

// const userNotAllowedPath = ["/DELETE"];

router.get("/users", (req, res) => {
  userController.getAllUser(req, res);
});

router.get("/:id", (req, res) => {
  userController.getOneUser(req, res);
});

router.put("/", (req, res) => {
  userController.updateUser(req, res);
});

router.delete("/:id", (req, res) => {
  // const match = userNotAllowedPath.find((val) => val.method == req.method);
  // if (match) {
  //   const userRole = req.user.role;
  //   if (userRole == admin) {
  userController.deleteUser(req, res);
  //     next();
  //   } else {
  //     res.status(400).json("You don't have permission ");
  //   }
  // }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin } = require("../controllers/auth");

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "fill the password filed").isLength({ min: 3 }),
  ],
  signin
);

router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password atleast 3 char").isLength({ min: 3 }),
  ],
  signup
);

router.get("/signout", signout);

module.exports = router;

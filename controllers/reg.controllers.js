const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
//create new student (Register user)

router.post("/", body("email").isEmail(), async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const usedEmail = await User.findOne({ email: req.body.email });

    console.log(req.body.password);

    if (!usedEmail) {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      });
      const user = await newUser.save();

      const token = jwt.sign({ email: user.email }, "secretValue", {
        expiresIn: "1h",
      });
      delete user.password;
      // console.log(req.body.password);
      res.status(200).json({
        message: "Login Successfully",
        token,
        user,
      });
    } else {
      res.status(403).json("user already exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//login already register user (Login User)
router.post("/login", async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("invalid email and password");

    const validatePassword = bcrypt.compare(user.password, req.body.password);
    // const { password, ...getUserInfo } = user;
    if (validatePassword) {
      const token = jwt.sign({ email: user.email }, "secretValue", {
        expiresIn: "1h",
      });

      delete user.password;
      res.status(200).json({ token, user });
    } else {
      res.status(403).json({ errors: "invalid password and password" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//Updating user info
// router.put("/:id", async (req,res)=>{

// })

router.get("/findUserId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("You have to login");

    const userId = user._id;
    userId && res.status(200).send(userId);
  } catch (err) {
    console.log(err);
  }
});

// Get user detail by get id
router.get("/getUserDetails", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.userId });
    !user && res.status(404).send("You have to login");

    user && res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;

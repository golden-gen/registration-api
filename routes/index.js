const Student = require("../models/student.model");
const School = require("../models/school.model");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
//create new student (Register user)

router.post("/student", async (req, res) => {
  // body("email").isEmail(),
  // Finds the validation errors in this request and wraps them in an object with handy functions
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newStudent = await Student.create(req.body);
    // const registeredStudent = newStudent.save();
    const id = newStudent.phoneNo.slice(-8);
    // console.log(newStudent.phoneNo.slice(-8));
    res.status(200).json({
      message: `Registered Successfully`,
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//login already register user (Login User)
router.post("/school", async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  try {
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newSchool = await School.create(req.body);
    res.status(200).json({
      message: "Registered Successfully",
      data: newSchool,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/students", async (req, res) => {
  try {
    const users = await Student.find();

    res.status(200).json({
      message: "Retrieve data successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json(error.message);
  }
});

router.get("/schools", async (req, res) => {
  try {
    const users = await School.find();

    res.status(200).json({
      message: "Retrieve data successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json(error.message);
  }
});

// Get user detail by get id
// router.get("/getUserDetails", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.userId });
//     !user && res.status(404).send("You have to login");

//     user && res.status(200).send(user);
//   } catch (err) {
//     console.log(err);
//   }
// });
module.exports = router;

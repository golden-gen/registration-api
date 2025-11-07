const Student = require("../models/student.model");
const School = require("../models/school.model");
const Result = require("../models/result.model");
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
    generatedId = Math.floor(Math.random() * 100000) + 1;

    const data = await Student.findOne({ phoneNo: req.body.phoneNo });
    if (data) {
      return res.status(400).json({
        message: "Phone number already registered",
      });
    }

    const payload = {
      ...req.body,
      RegistrationId: `GGQUIZ2025-${generatedId}`,
    };

    const newStudent = await Student.create(payload);
    // const registeredStudent = newStudent.save();
    // const id = newStudent.phoneNo.slice(-8);

    const registrationNo = `GGQUIZ2025-${generatedId}`;
    // console.log(newStudent.phoneNo.slice(-8));
    res.status(200).json({
      message: `Registered Successfully`,
      data: { ...newStudent._doc, studentId: registrationNo },
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
    // throw new Error("Invalid email or password");
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

// Assign RegistrationId to students missing it
router.post("/students/fix-registration", async (req, res) => {
  try {
    const students = await Student.find();

    const withoutReg = students.filter(
      (s) => !s.RegistrationId || String(s.RegistrationId).trim() === ""
    );

    const usedIds = new Set();
    const prefix = "GGQUIZ2025-";
    const generateId = () => Math.floor(Math.random() * 100000) + 1;

    await Promise.all(
      withoutReg.map(async (s) => {
        let idNum = generateId();
        // Ensure uniqueness within this operation run
        while (usedIds.has(idNum)) {
          idNum = generateId();
        }
        usedIds.add(idNum);
        const regId = `${prefix}${idNum}`;
        await Student.updateOne(
          { _id: s._id },
          { $set: { RegistrationId: regId } }
        );
      })
    );

    const updatedStudents = await Student.find();

    res.status(200).json({
      message: "Assigned registration IDs to students missing them",
      data: {
        updatedCount: withoutReg.length,
        students: updatedStudents,
      },
    });
  } catch (error) {
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

router.post("/result", async (req, res) => {
  try {
    const newResult = await Result.create(req.body);
    res.status(200).json({
      message: "Result submitted successfully",
      data: newResult,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/results", async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json({
      message: "Results retrieved successfully",
      data: results,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Generate templated messages for all students
router.get("/students/messages", async (req, res) => {
  try {
    const students = await Student.find();

    const toFirstName = (student) => {
      const source =
        (student.othersName || "").trim() || (student.surname || "").trim();
      if (!source) return "Student";
      return source.split(/\s+/)[0];
    };

    const messages = students.map((s) => {
      const firstName = toFirstName(s);
      const registrationId = (s.RegistrationId || "").trim();
      return (
        `Dear ${firstName},\n\n` +
        `Your CBT for the Golden Generation Quiz 2025 is scheduled for Saturday, November 8th, at 9:00 AM at Oranyan Grammar School 1, Sabo Oyo.\n\n` +
        `Your Registration ID: ${registrationId}\n\n` +
        `Note: It's important you come with your registration ID and ensure you are punctual to the center. Thank you.`
      );
    });

    res.status(200).json({
      message: "Messages generated successfully",
      data: messages,
    });
  } catch (error) {
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

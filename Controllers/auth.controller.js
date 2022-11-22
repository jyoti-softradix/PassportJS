const db = require("../Models/index");
const express = require("express");
const { generateToken, comparePass } = require("../Common/helper");
const nodeMailer = require("../Common/nodeMailer");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const Users = db.user;
const salt = 10;

//create user
async function signup(req, res) {
  try {
    const { first_name, last_name, email, username, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // if (!name || !email || !username || !password) {
    //   return res.status(401).send({
    //     success: false,
    //     message: "Invalid User",
    //   });
    // }
    const hash = await bcrypt.hash(password, salt);
    const userObj = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      username: username,
      password: hash,
      role: role,
    };
    const result = await Users.create(userObj);
    res.status(200).json("User signup successfully",result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

//login
//generate and compare password
async function loginUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const result = await Users.findOne({
      where: { Username: username },
    });

    const userData = result.toJSON();
    const match = await comparePass(password, userData.password);
    console.log("match", match);
    if (match) {
      const otpCode = Math.floor(Math.random() * 1000000 + 1);
      await result.update({ otp: otpCode });
      // const msg =
      //   "Never give up what you really want to do. The person with big dreams is more powerful than one with all the facts";
      if (otpCode) {
        const to = userData.Email;
        const subject = "My app verification";
        const html = `<h1> My app verification otp is: <b>${otpCode}</b></h1>`;

        const emailStatus = nodeMailer.sendMail(to, subject, html);
        if (emailStatus) {
          res.status(200).json({
            message: "Mail has been sent to your registered email",
          });
        } else {
          //Email not sent
          res.status(400).json({
            message: "Something went wrong",
          });
        }
      } else {
        res.status(401).json({
          message: "please check your internet connection",
        });
      }
      // res.status(200).json(result);
    } else {
      res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

//verifying otp
async function verifyOtp(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, otp } = req.body;
    const data = await Users.findOne({
      where: { username: username },
    });
    const userData = data.toJSON();
    if (otp !== userData.otp) {
      res.status(401).json({ message: "Invalid user" });
    } else {
      const token = await generateToken(JSON.stringify(userData), res);
      const noPassAndOtp = await Users.findOne({
        where: { username: username },
        attributes: { exclude: ["password", "otp"] },
      });
      const finalOutput = noPassAndOtp.toJSON();
      const user = {
        ...finalOutput,
        token,
      };
       res.status(200).json({ message: "Login successfully", user });
    }
  } catch (e) {
    res.status(500).json("error", err.message);
  }
}

module.exports = {
  loginUser,
  signup,
  verifyOtp,
  //forgetPassword,
};

//resetPassword
// async (req, res) => {
//   try {
//     const { password, retype } = req.body;
//     if (password && retype) {
//       if (password !== retype) {
//         res.json({ message: "password not same" });
//       } else {
//         let hashPassword = await bcrypt.hash(password, Salt);
//         password = hashPassword;
//         await USER.findOneAndUpdate(
//           { _id: req.params._id },
//           { $set: { password: data } }
//         );
//         res.json({ message: "your password successfully updated" });
//       }
//     } else {
//       res.json({ error: "user not found" });
//     }
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// };

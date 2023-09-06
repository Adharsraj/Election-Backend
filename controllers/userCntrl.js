const UserModal = require("../models/UserModal");
const path = require("path");
const nodemailer = require("nodemailer");
const cloudinary = require("../utils/cloudinary");
const fast2sms=require('fast-two-sms')


const showUser = async (req, res) => {
  try {
    const showUser = await UserModal.find({});
    res.status(200).send({ showUser });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("An error occurred ");
  }
};


const otpData = {};
const otpStorage = {};

const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  const User = await UserModal.findOne({ email });

  console.log("iam user", User);
  if (!User) {
    return res.status(401).send("email not registered");
  }
  const generatedOtp = Math.floor(1000 + Math.random() * 9000);

  otpData[email] = {
    otp: generatedOtp,
    expiration: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adarshrajashekhar@gmail.com",
      pass: "mqhycvouhfdzheun",
    },
    
  });

  const mailOptions = {
    from: "yourgmail@gmail.com", // Replace with your Gmail email
    to: email,
    subject: "OTP Verification",
    html: `<h1>Your OTP: ${generatedOtp}</h1>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
};

const verifyemailotp = async (req, res) => {
  const { email, otp } = req.body;
  const User = await UserModal.findOne({ email });

  console.log("iam user", User);
  if (!User) {
    return res.status(401).send("email not registered");
  }
  const storedOtp = otpData[email]?.otp;
  const expiration = otpData[email]?.expiration;

  if (!storedOtp || !expiration || Date.now() > expiration) {
    return res
      .status(400)
      .json({ verified: false, message: "OTP expired or invalid" });
  }

  if (Number(otp) === storedOtp) {
    const token = User.createJWT();

    return res
      .status(200)
      .json({
        verified: true,
        message: "OTP verified successfully",
        User,
        token,
      });
  } else {
    return res.status(400).json({ verified: false, message: "Invalid OTP" });
  }
};

const sendPhoneOtp = async (req, res) => {

function generateRandomOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
  try {

    const { otpmobilenumber } = req.body;
    const User = await UserModal.findOne({ otpmobilenumber });
    console.log("iam user", User);
    if (!User) {
      return res.status(401).send("Phone number not registered");
    }
    const otp = generateRandomOTP();

        // await fast2sms.sendMessage({
        //   authorization:"LzDfy8EGHOTJwIxZB2WM9YbmFkcp0avodP3jg5CVitX4elqQh1zgl5y4rbwAYfDGJxcetus8T1aHWROS",
        //   message: `Your OTP is ${otp}. Please enter this to complete registration.`,
        //   numbers: [req.body.otpmobilenumber],
        // });
    console.log("otp", otp);
    if (otp) {
      otpStorage[otpmobilenumber] = otp;
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyPhoneOtp = async (req, res) => {
  try {
    const { otpmobilenumber, otp } = req.body;

    const User = await UserModal.findOne({ otpmobilenumber });
    console.log("iam user", User);
    if (!User) {
      return res.status(401).send("Phone number not registered");
    }
    // Retrieve the stored OTP
    const storedOtp = otpStorage[otpmobilenumber];
    console.log(storedOtp);
    if (storedOtp && storedOtp === otp) {
      // OTP is valid
      // Remove the OTP from storage to prevent reuse
      delete otpStorage[otpmobilenumber];
      const token = User.createJWT();

      res.status(200).json({ message: "OTP is valid", token, User });
    } else {
      // OTP is invalid
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addNewUser = async (req, res) => {
  const {
    membershipnumber,
    username,
    dob,
    userImage,
    age,
    contactnumber,
    otpmobilenumber,
    votingtype,
    presentAddress,
    permanentAddress,
    nomineeName,
    currentposition,
    aadharnumber,
    profession,
    remarks,
    email,
  } = req.body;
  try {
    const result = await cloudinary.uploader.upload(userImage, {
      folder: "products",
      width: 500,
      height: 300,
      crop: "scale",
    });
    console.log("result", result);
    const newUser = await UserModal.create({
      public_id: result.public_id,
      url: result.secure_url,
      membershipnumber,
      username,
      dob,
      userImage,
      age,
      email,
      contactnumber,
      otpmobilenumber,
      votingtype,
      presentAddress,
      permanentAddress,
      nomineeName,
      currentposition,
      aadharnumber,
      profession,
      remarks,
    });
    await newUser.save();
    res.status(200).send({ user: newUser, msg: "user added" });
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  const userId = req.body.editedUser._id;
  const updatedUserData = req.body.editedUser;
  try {
    await UserModal.findByIdAndUpdate(userId, updatedUserData);
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred");
  }
};

const deleteUser = async (req, res) => {
  const userId = req.body.id;
  try {
    await UserModal.findByIdAndRemove(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = {
  showUser,
  addNewUser,
  editUser,
  deleteUser,
  sendEmailOtp,
  verifyemailotp,
  sendPhoneOtp,
  verifyPhoneOtp,
};

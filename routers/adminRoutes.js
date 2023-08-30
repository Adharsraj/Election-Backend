const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fast2sms=require('fast-two-sms')
const {getAllRepresentative, addRepresentatives, deleteRep, editRep, deletee} = require("../controllers/repCntrl");
const { getOngoingElections, startNewElection, getSingleElection } = require("../controllers/electionCntrl");
const { castVote, getSingleVoteCollection, getAllVoteCollection } = require("../controllers/votingCntrl");
const { addNewUser, showUser, editUser, deleteUser, sendEmailOtp, verifyemailotp } = require("../controllers/userCntrl");
const { verifyTokenget,verifyTokenpost, checkAdminRole, checkUserRole, sendOtp, verifyOtp } = require("../controllers/authCntrl");
const UserModal = require("../models/UserModal");





router.post('/send-otp', async (req, res) => {
    console.log(req.body)
    const phone=req.body.otpmobilenumber;
    const { otpmobilenumber } = req.body;

    try {
        const User = await UserModal.findOne({ otpmobilenumber });
        console.log("iam user",User)
        if (!User) {
            return res.status(401).send("Phone number not registered");
     }
        const otp = Math.floor(100000 + Math.random() * 900000); 

      // await fast2sms.sendMessage({
      //   authorization:"LzDfy8EGHOTJwIxZB2WM9YbmFkcp0avodP3jg5CVitX4elqQh1zgl5y4rbwAYfDGJxcetus8T1aHWROS",
      //   message: `Your OTP is ${otp}. Please enter this to complete registration.`,
      //   numbers: [req.body.phoneNumber],
      // });
      console.log("sucess otp",otp);
      const token = User.createJWT();
      res.status(200).send({otp:otp ,User,
        token,});

    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = '../frontend/public/uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });

  router.post('/upload', upload.single('profileImage'), (req, res) => {
console.log("dsdsdsd6666")
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const imageUrl = req.file.path; // This is the URL to save in your database
    res.status(200).json({ imageUrl });
  });

router.post("/verifyemailotp", verifyemailotp);
router.post("/sendemailotp",sendEmailOtp);
router.post("/adduser",verifyTokenpost,checkAdminRole, addNewUser);
router.post("/edituser",verifyTokenpost,checkAdminRole,editUser );
router.post("/deleteuser",verifyTokenpost,checkAdminRole, deleteUser);
router.post("/deleterep",verifyTokenpost,checkAdminRole, deleteRep);
router.post("/deletee",verifyTokenpost,checkAdminRole, deletee);
router.post("/addrepresentative",verifyTokenpost,checkAdminRole,addRepresentatives )
router.get("/addrepresentative",verifyTokenget,checkAdminRole,getAllRepresentative )
router.post("/electiondata",verifyTokenpost,checkAdminRole,startNewElection )
router.get("/electiondata",verifyTokenget,checkAdminRole,getOngoingElections)
router.post("/vote",verifyTokenpost,checkUserRole, castVote)
router.get('/collections/:collectionId',verifyTokenget, getSingleVoteCollection)
router.get('/getsingleelection/:collectionId',verifyTokenget, getSingleElection);
router.get("/vote",verifyTokenget,  getAllVoteCollection);
router.get("/showuser",verifyTokenget,checkAdminRole,showUser)

// verifyToken
  
module.exports = router;


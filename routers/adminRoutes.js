const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fast2sms=require('fast-two-sms')
const {getAllRepresentative, addRepresentatives, deleteRep, editRep, deletee} = require("../controllers/repCntrl");
const { getOngoingElections, startNewElection, getSingleElection } = require("../controllers/electionCntrl");
const { castVote, getSingleVoteCollection, getAllVoteCollection, addOfflineVote } = require("../controllers/votingCntrl");
const { addNewUser, showUser, editUser, deleteUser, sendEmailOtp, verifyemailotp, sendPhoneOtp, verifyPhoneOtp } = require("../controllers/userCntrl");
const { verifyTokenget,verifyTokenpost, checkAdminRole, checkUserRole, sendOtp, verifyOtp } = require("../controllers/authCntrl");
const UserModal = require("../models/UserModal");
const session = require('express-session');


router.post('/send-otp', sendPhoneOtp);
router.post('/verify-otp',verifyPhoneOtp);
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
router.post("/offlinevote",verifyTokenpost,checkAdminRole,addOfflineVote  );
router.get("/showuser",verifyTokenget,checkAdminRole,showUser)

// verifyToken
  
module.exports = router;


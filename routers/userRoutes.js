const express = require("express");
const router = express.Router();
const {showUser} = require("../controllers/userCntrl");
const {userLogin, checkAdminRole, verifyTokenpost, verifyTokenget, checkUserRole} = require("../controllers/authCntrl");
const { castVote } = require("../controllers/votingCntrl");
const { getOngoingElections } = require("../controllers/electionCntrl");
const { getAllRepresentative } = require("../controllers/repCntrl");
router.get("/showuser",verifyTokenget,showUser)
router.post("/userlogin",userLogin );
router.get("/addrepresentative",verifyTokenget,getAllRepresentative )
router.post("/vote",verifyTokenpost, castVote)
router.get("/electiondata",verifyTokenget,checkUserRole,getOngoingElections)
module.exports = router;

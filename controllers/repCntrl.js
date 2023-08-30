const electionModal = require("../models/electionModal");
const RepModal = require("../models/repModal");

const getAllRepresentative = async (req, res) => {
  try {
    const Representative = await RepModal.find({});
    res.status(200).send({ Representative });
  } catch (error) {
    console.log(error);
  }
};

const addRepresentatives = async (req, res) => {
  console.log("iam ad rep",req.body)
  try {
    const emailexist = await RepModal.findOne({ email: req.body.repfields.email });
    if (emailexist) {
      res.send({ msg: "Email already exists" });
    } else {
      const representative = await RepModal.create(req.body.repfields);
      res.status(200).send({ msg: "Representative added", representative });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "An error occurred" });
  }
};


const editRep = async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  
  try {
    await RepModal.findByIdAndUpdate(userId, updatedUserData);
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred");
  }
};

const deleteRep = async (req, res) => {
  const userId = req.body.id;
  try {
    await RepModal.findByIdAndRemove(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred");
  }
};


const deletee = async (req, res) => {
  const userId = req.body.id;
  try {
    await electionModal.findByIdAndRemove(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { getAllRepresentative, addRepresentatives,editRep,deleteRep,deletee };

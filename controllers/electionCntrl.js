const ElectionModal = require("../models/electionModal");

const getOngoingElections = async (req, res) => {
  try {
    const election = await ElectionModal.find({});
    res.status(200).send({ election });
  } catch (error) {
    console.log(error);
  }
};
 
const addIdtoElectionData = async (req, res) => {
  console.log("imaddIdtoElectionData", req.body);

  try {
    // Extract the userid and id from req.body
    const { userid, id } = req.body;

    // Find the election by id from electionmodals
    const election = await ElectionModal.findById(id);
console.log(" this is election",election)
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    // Add the userid to the array
    election.userid.push(userid);

    // Save the updated election document
    await election.save();

    res.status(200).json({ message: "User ID added to the election" });
  } catch (error) {
    console.error("Error adding user ID to election:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const startNewElection = async (req, res) => {
  console.log("im election data",req.body)
  try {
    const election = await ElectionModal.create(req.body.dataToSend);
    res.status(200).send({ election });
  } catch (error) {
    console.log(error);
  }
};


const getSingleElection = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const collection = await ElectionModal.findById(collectionId);
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ error: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getOngoingElections, startNewElection, getSingleElection,addIdtoElectionData };

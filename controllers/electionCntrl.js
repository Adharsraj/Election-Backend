const ElectionModal = require("../models/electionModal");

const getOngoingElections = async (req, res) => {
  try {
    const election = await ElectionModal.find({});
    res.status(200).send({ election });
  } catch (error) {
    console.log(error);
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

module.exports = { getOngoingElections, startNewElection, getSingleElection };

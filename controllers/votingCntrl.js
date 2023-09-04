const VoteModal = require("../models/voteModal");

const castVote = async (req, res) => {
  try {
    const result = await VoteModal.updateOne(
      { _id: req.body.votedData.id },
      {
        $push: { RepresentativeName: req.body.votedData.personName, userid: req.body.votedData.userid },
        $set: {
          voted: true,
          startDate: req.body.votedData.startDate,
          endDate: req.body.votedData.endDate,
          electionName: req.body.votedData.electionName,
        },
      },
      { upsert: true }
    );
    res.status(200).send({ result });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};



const getSingleVoteCollection = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const collection = await VoteModal.findById(collectionId);
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ error: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting single voting data" });
  }
};

const getAllVoteCollection = async (req, res) => {
  try {
    const votes = await VoteModal.find({});
    res.status(200).send({ votes });
  } catch (error) {
    res.status(500).json({ error: "Error getting single voting data" });
  }
};

const addOfflineVote = async (req, res) => {
  console.log(req.body)
  try {
    const offlineVote = await VoteModal.findById(req.body.electionId);

    if (!offlineVote) {
      return res.status(404).json({ message: "Election not found" });
    }

    offlineVote.RepresentativeName.push(...req.body.names);

    await offlineVote.save();

    return res.status(200).json({ message: "Names added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { castVote, getSingleVoteCollection, getAllVoteCollection,addOfflineVote };

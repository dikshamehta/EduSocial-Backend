import Poll from '../models/Poll.js';


/* Read/GET */
export const getPollData = async (req, res) => {
    try {
        const { id } = req.params; //Grab relevant post by id
        const poll = await Poll.findOne({ parentId: id }); //Get poll by parentId
        res.status(200).json(poll); //Return poll, sends back to front end
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Update/PATCH */
export const votePoll = async (req, res) => {
    try {
        const { id } = req.params; //Grab relevant post by id
        const { option } = req.body; //Grab option from req.body
        const poll = await Poll.findOne({ parentId: id }); //Get poll by parentId
        const voteIndex = poll.options.findIndex((pollOption) => pollOption.option === option); //Find the index of the option
        poll.options[voteIndex].votes = poll.options[voteIndex].votes + 1; //Increment the votes
        poll.totalVotes = poll.totalVotes + 1; //Increment the totalVotes
        const updatedPoll = await Poll.findOneAndUpdate({ parentId: id }, poll, { new: true }); //Update the poll
        res.status(200).json(updatedPoll); //Return updated poll, sends back to front end
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
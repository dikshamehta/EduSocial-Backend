import Poll from '../models/Poll.js';
import Post from '../models/Post.js';


/* Read/GET */
export const getPollData = async (req, res) => {
    try {
        const { id } = req.params; 
        const poll = await Poll.findOne({ parentId: id }); //Get poll by parentId
        res.status(200).json(poll); 
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Update/PATCH */
export const votePoll = async (req, res) => {
    try {
        const { id } = req.params; 
        const { option } = req.body;
        const { userId } = req.body;
        const poll = await Poll.findOne({ parentId: id });
        poll.voters.push(userId);
        poll.totalVotes += 1;
        poll.options.map((o) => {
            if (o.option === option) {
                o.votes += 1;
            }
        });
        await poll.save();
        res.status(200).json(poll);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
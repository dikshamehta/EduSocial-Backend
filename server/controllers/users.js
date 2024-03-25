import User from "../models/User.js";

//This is where the logic for the CRUD operations will go

//3 functions: getUser, getUserFriends, addRemoveFriend
//1. getUser - Get the user by their ID
//2. getUserFriends - Get the user's friends by their ID
//3. addRemoveFriend - Add or remove a friend by their ID

/* Read/PATCH */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params; //Grab id
        const user = await User.findById(id); //Get user by id
        res.status(200).json(user); //Return user, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params; //Grab id
        const user = await User.findById(id); //Get user by id
    
        const friends = await Promise.all( //Makes multiple API calls to the database
            user.friends.map((id) => User.findById(id)) //Get all friends by their id
        );
        const formattedFriends = friends.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );
        res.status(200).json(formattedFriends); //Return friends, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err.message });
    }

};

/* Update/PATCH */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params; //Grab id and friendId
        const user = await User.findById(id); //Get curret user information by id
        const friend = await User.findById(friendId); //Get friend information by id

        if (user.friends.includes(friendId)) { //If user already has friend, remove friend
            user.friends = user.friends.filter((id) => id !== friendId); //Filter out friend
            friend.friends = friend.friends.filter((id) => id !== id); //Filter out user from friend's friends list
        }
        else { //If user does not have friend, add friend
            user.friends.push(friendId); //Add friend
            friend.friends.push(id); //Add user to friend's friends list
        }
        
        await user.save; //Save user information
        await friend.save; //Save friend information

        //Same as getUserFriends
        const friends = await Promise.all( //Makes multiple API calls to the database
            user.friends.map((id) => User.findById(id)) //Get all friends by their id
        );  
        const formattedFriends = friends.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedFriends); //Return friends, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
}
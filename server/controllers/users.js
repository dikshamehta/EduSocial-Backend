import User from "../models/User.js";
import Page from "../models/Page.js";

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

export const getUserFriendRequests = async (req, res) => {
    try {
        const { id } = req.params; //Grab id
        const user = await User.findById(id); //Get user by id

        const friendRequests = await Promise.all( //Makes multiple API calls to the database
            user.friendRequests.map((id) => User.findById(id)) //Get all friend requests by their id
        );
        const formattedFriendRequests = friendRequests.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );
        res.status(200).json(formattedFriendRequests); //Return friend requests, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const getBlockedUsers = async (req, res) => {
    try {
        const { id } = req.params; //Grab id
        const user = await User.findById(id); //Get user by id

        const blockedUsers = await Promise.all( //Makes multiple API calls to the database
            user.blockedUsers.map((id) => User.findById(id)) //Get all blocked users by their id
        );
        const formattedBlockedUsers = blockedUsers.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedBlockedUsers); //Return blocked users, sends back to front end
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

        if (id === friendId) { //If user is trying to add themselves as a friend
            return; //Return error
        }

      

        if (user.friends.includes(friendId)) { //If user already has friend, remove friend
            user.friends = user.friends.filter((id) => id !== friendId); //Filter out friend
            friend.friends = friend.friends.filter((id) => id !== id); //Filter out user from friend's friends list
        }
        else { //If user does not have friend, add friend
            // user.friends.push(friendId); //Add friend
            // friend.friends.push(id); //Add user to friend's friends list
            friend.friendRequests.push(id); //Add user to friend's friend requests list
        }
        
        await user.save(); //Save user information
        await friend.save(); //Save friend information  

        //Same as getUserFriends
        const friends = await Promise.all( //Makes multiple API calls to the database
            user.friends.map((id) => User.findById(id)) //Get all friends by their id
        );  
        const formattedFriends = friends.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        const friendRequests = await Promise.all( //Makes multiple API calls to the database
            user.friendRequests.map((id) => User.findById(id)) //Get all friend requests by their id
        );
        const formattedFriendRequests = friendRequests.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        // res.status(200).json(formattedFriends); //Return friends, sends back to front end
        res.status(200).json({ friends: formattedFriends, friendRequests: formattedFriendRequests }); //Return friends and friend requests, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id, friendId } = req.params; //Grab id and friendId
        const user = await User.findById(id); //Get curret user information by id
        const friend = await User.findById(friendId); //Get friend information by id

        if (id === friendId) { //If user is trying to add themselves as a friend
            return; //Return error
        }

        if (user.friendRequests.includes(friendId)) { //If user has friend request, accept friend request
            user.friendRequests = user.friendRequests.filter((id) => id !== friendId); //Filter out friend request
            user.friends.push(friendId); //Add friend
            friend.friends.push(id); //Add user to friend's friends list
            // user.friendRequests.remove(friendId); //Remove friend request
        }

        await user.save(); //Save user information
        await friend.save(); //Save friend information

        //Same as getUserFriends
        const friends = await Promise.all( //Makes multiple API calls to the database
            user.friends.map((id) => User.findById(id)) //Get all friends by their id
        );
        const formattedFriends = friends.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );
        const friendRequests = await Promise.all( //Makes multiple API calls to the database
            user.friendRequests.map((id) => User.findById(id)) //Get all friend requests by their id
        );
        const formattedFriendRequests = friendRequests.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );


        res.status(200).json({ friends: formattedFriends, friendRequests: formattedFriendRequests }); //Return friends and friend requests, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { id, friendId } = req.params; //Grab id and friendId
        const user = await User.findById(id); //Get curret user information by id
        const friend = await User.findById(friendId); //Get friend information by id

        if (id === friendId) { //If user is trying to add themselves as a friend
            return; //Return error
        }

        if (user.friendRequests.includes(friendId)) { //If user has friend request, accept friend request
            user.friendRequests = user.friendRequests.filter((id) => id !== friendId); //Filter out friend request
            user.friendRequests.remove(friendId); //Remove friend request
        }

        await user.save(); //Save user information
        await friend.save(); //Save friend information

        //Same as getUserFriends
        const friends = await Promise.all( //Makes multiple API calls to the database
            user.friends.map((id) => User.findById(id)) //Get all friends by their id
        );
        const formattedFriends = friends.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );
        const friendRequests = await Promise.all( //Makes multiple API calls to the database
            user.friendRequests.map((id) => User.findById(id)) //Get all friend requests by their id
        );
        const formattedFriendRequests = friendRequests.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );


        res.status(200).json({ friends: formattedFriends, friendRequests: formattedFriendRequests }); //Return friends and friend requests, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
}

export const blockUser = async (req, res) => {
    try {
        const { id, userToBlockId } = req.params; //Grab id and userToBlockId
        const user = await User.findById(id); //Get current user information by id

        //Find the user to block by username - userToBlockId is the username
        const userToBlockUsername = userToBlockId;
        const userToBlock = await User.findOne({ username: userToBlockUsername });
        //Retrieve their id
        let actualUserToBlockId = userToBlock._id;

        if (id === actualUserToBlockId) { //If user is trying to block themselves
            return; //Return error
        }
        if (!user.blockedUsers.includes(actualUserToBlockId)) { //If user is not already blocked
            user.blockedUsers.push(actualUserToBlockId); //Block user
        }
        if (user.friends.includes(actualUserToBlockId)) { //If user is friends with user to block
            // user.friends = user.friends.filter((id) => id !== actualUserToBlockId); //Filter out friend
            // userToBlock.friends = userToBlock.friends.filter((id) => id !== id); //Filter out user from friend's friends list
            user.friends.remove(actualUserToBlockId); //Remove friend
            userToBlock.friends.remove(id); //Remove user from friend's friends list
        }
        if (user.friendRequests.includes(actualUserToBlockId)) { //If user has friend request from user to block
            // user.friendRequests = user.friendRequests.filter((id) => id !== actualUserToBlockId); //Filter out friend request
            user.friendRequests.remove(actualUserToBlockId); //Remove friend request

        }

        await user.save(); //Save user information
        await userToBlock.save(); //Save userToBlock information

        const blockedUsers = await Promise.all( //Makes multiple API calls to the database
            user.blockedUsers.map((id) => User.findById(id)) //Get all blocked users by their id
        );
        const formattedBlockedUsers = blockedUsers.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedBlockedUsers); //Return blocked users, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { id, userToUnblockId } = req.params; //Grab id and userToUnblockId
        const user = await User.findById(id); //Get current user information by id
        const userToUnblock = await User.findById(userToUnblockId);

        console.log(user);
        console.log(userToUnblock);


        // const userToUnblockUsername = userToUnblockId;
        // let actualUserToUnblockId = userToUnblock._id;



        // const userToUnblock = await User.findById(userToUnblockId);

        if (id === userToUnblockId) { //If user is trying to unblock themselves
            return; //Return error
        }

        //Look for the user to unblock by their id
        if (user.blockedUsers.includes(userToUnblockId)) { //If user is blocked
            // user.blockedUsers = user.blockedUsers.filter((id) => id !== userToUnblockId); //Filter out user
            user.blockedUsers.remove(userToUnblockId); //Unblock user
        }

        // if (user.blockedUsers.includes(userToUnblockId)) { //If user is blocked
        //     user.blockedUsers = user.blockedUsers.filter((id) => id !== userToUnblockId); //Unblock user

        // }

        user.blockedUsers = user.blockedUsers.filter((id) => id !== userToUnblockId); //Unblock user

        await user.save(); //Save user 
        
        const blockedUsers = await Promise.all( //Makes multiple API calls to the database
            user.blockedUsers.map((id) => User.findById(id)) //Get all blocked users by their id
        );
        const formattedBlockedUsers = blockedUsers.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedBlockedUsers); //Return blocked users, sends back to front end


    } catch (err) {
        res.status(404).json({ error: err });
    }
};

export const changeSettings = async (req, res) => {
    try {
        const { id } = req.params; //Grab id
        const user = await User.findById(id); //Get user by id
        console.log(user);
        console.log(req.body);

        const { emailPrivacy, profilePrivacy, recentPostOrder } = req.body; //Grab profilePrivacy and emailPrivacy
        console.log("Profile Privacy: " + profilePrivacy);
        console.log("Email Privacy: " + emailPrivacy);
        console.log("Recent Post Order: " + recentPostOrder);
        user.profilePrivacy = profilePrivacy; //Update profilePrivacy
        user.emailPrivacy = emailPrivacy; //Update emailPrivacy
        user.recentPostOrder = recentPostOrder; //Update recentPostOrder

        await user.save(); //Save user information

        res.status(200).json(user); //Return user, sends back to front end
    } catch (err) {
        res.status(404).json({ error: err });
    }
}

export const getNotifications = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user.notifications);
    } catch (err) {
        res.status(404).json({ error: err });
    }
}

export const sendNotification = async (req, res) => {
    try {
      const { id } = req.params;
      const { message, link } = req.body;
      console.log(req.params);
      console.log(req.body);
      const user = await User.findById(id);
      user.notifications.push({ message: message, link: link });
      await user.save();
      res.status(200).json(user.notifications);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
}

export const removeNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notificationId } = req.body;
    const user = await User.findById(id);
    user.notifications = user.notifications.filter(
      (notification) => notification._id != notificationId
    );
    await user.save();
    res.status(200).json(user.notifications);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export const joinPage = async (req, res) => {
    try {
        const { id, pageId } = req.params;
        console.log(id, pageId);
        const user = await User.findById(id);
        const page = await Page.findById(pageId);
        console.log(user.joinedPages, page.pageMembers);

        if (!page) throw new Error("Page does not exist");

        if (!user.joinedPages.includes(pageId)) {
            user.joinedPages.push(pageId);
            await user.save();
        }

        if (!page.pageMembers.includes(id)) {
            page.pageMembers.push(id);
            await page.save();
        }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}
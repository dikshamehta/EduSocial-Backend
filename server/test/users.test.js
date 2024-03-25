import User from "../models/User.js";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";

jest.mock("../models/User.js");

describe("getUser", () => {
  it("should return user data when a valid user ID is provided", async () => {
    // Mocking user data
    const userData = {
      _id: "1",
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
    };

    User.findById.mockResolvedValue(userData);

    const req = { params: { id: "1" } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(userData);
  });

  it("should return a 404 error when an invalid user ID is provided", async () => {
    User.findById.mockRejectedValue(new Error("User not found"));

    const req = { params: { id: "invalid_id" } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

describe("getUserFriends", () => {
  it("should return user friends when a valid user ID is provided", async () => {
    const user = {
      _id: "1",
      username: "testuser1",
      friends: ["2", "3"],
    };
    const friends = [
      { _id: "2", username: "friend1" },
      { _id: "3", username: "friend2" },
    ];

    User.findById.mockResolvedValueOnce(user);
    User.findById.mockResolvedValueOnce(friends[0]);
    User.findById.mockResolvedValueOnce(friends[1]);

    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserFriends(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(friends);
  });

  it("should return 404 error when an invalid user ID is provided", async () => {
    const errorMessage = "User not found";
    User.findById.mockRejectedValueOnce(new Error(errorMessage));

    const req = { params: { id: "invalid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserFriends(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("addRemoveFriend", () => {
  it("should add friend and return updated friends list", async () => {
    const user = {
      _id: "1",
      username: "testuser1",
      friends: [],
    };
    const friend = {
      _id: "2",
      username: "testuser2",
      friends: [],
    };

    User.findById.mockResolvedValueOnce(user);
    User.findById.mockResolvedValueOnce(friend);
    User.findById.mockResolvedValueOnce(friend);

    const req = { params: { id: "1", friendId: "2" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addRemoveFriend(req, res);

    expect(user.friends).toEqual(["2"]);
    expect(friend.friends).toEqual(["1"]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
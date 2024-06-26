import Post from "../models/Post.js";
import User from "../models/User.js";
import Page from "../models/Page.js"

export const search = async (req, res) => {
    const query = req.body.search_string;
    // TODO: check for indexes here and raise an error if indexes not present
    try {
        //$text: { $search: "coffee" }
        // const users = await User.find({ $text: { $search: query} });
        const users = await User.find(
            { $or:
                    [
                        {
                            username: { $regex: query, $options: 'i' }
                        },
                        {
                            firstName: { $regex: query, $options: 'i' }
                        },
                        {
                            lastName: { $regex: query, $options: 'i' }
                        },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$firstName", " ", "$lastName"] },
                                    regex: query,
                                    options: "i"
                                }
                            }
                        },
                        {
                            email: { $regex: query, $options: 'i' }
                        }
                    ]
                });
        const posts = await Post.find(
            { $or:
                    [
                        {
                            firstName: { $regex: query, $options: 'i' }
                        },
                        {
                            lastName: { $regex: query, $options: 'i' }
                        },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$firstName", " ", "$lastName"] },
                                    regex: query,
                                    options: "i"
                                }
                            }
                        },
                        {
                            description: { $regex: query, $options: 'i' }
                        }
                    ]
            });

        const pages = await Page.find(
            { $or:
                    [
                        {
                            pageName: { $regex: query, $options: 'i' }
                        },
                        {
                            pageDescription: { $regex: query, $options: 'i' }
                        },
                        {
                            events: {
                                $elemMatch: {
                                    $or: [
                                        { name: { $regex: query, $options: 'i' } },
                                        { description: { $regex: query, $options: 'i' } }
                                    ]
                                }
                            }
                        }
                    ]
            });


        res.json({ users, posts, pages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
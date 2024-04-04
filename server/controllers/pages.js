import e from "express";
import Page from "../models/Page.js";
import User from "../models/User.js";

//This is where the logic for the CRUD operations will go

// 3 functions: getPages, getPage, createPage
// 1. createPage - Create a new page
// 2. getPages - Get all the pages
// 3. getPage - Get the page by its ID

/* Create/POST */
export const createPage = async (req, res) => {
    try {
        const {
          pageName,
          pageType,
          pageDescription,
          pagePicturePath,
          userId,
        } = req.body;
        const newPage = new Page({
            pageName,
            pageType,
            pageDescription,
            pagePicturePath,
            userId,
            pageMembers: [userId], // Add the user who created the page as a member
        });

        const savedPage = await newPage.save(); // Save new page
        res.status(201).json(savedPage);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* Read/GET */
export const getPages = async (req, res) => {
    try {
        const pages = await Page.find(); //Get all pages
        res.status(200).json(pages); //Return all pages, sends back to front end
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Read/GET */
export const getPage = async (req, res) => {
    try {
        const { pageId } = req.params; //Grab pageId
        const page = await Page.findById(pageId); //
        res.status(200).json(page); //Return page, sends back to front end
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Read/GET */
export const getMembers = async (req, res) => {
    try {
        const { pageId } = req.params;
        const page = await Page.findById(pageId);

        const members = await Promise.all(
            page.pageMembers.map((id) => User.findById(id)) 
        );
        const formattedMembers = members.map(
            ({ _id, username, firstName, lastName, picturePath }) => {
                return { _id, username, firstName, lastName, picturePath };
            }
        );
        res.status(200).json(formattedMembers);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/* Update/PUT */
export const updatePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { pageName, pageType, pageDescription, pagePicturePath, events } = req.body;
        const updatedFields = {};

        // Ew, but it works
        if (pageName !== '' && pageName !== null) {
            updatedFields.pageName = pageName;
        }
        if (pageType !== '' && pageType !== null) {
            updatedFields.pageType = pageType;
        }
        if (pageDescription !== '' && pageDescription !== null) {
            updatedFields.pageDescription = pageDescription;
        }
        if (pagePicturePath !== '' && pagePicturePath !== null && pagePicturePath !== 'undefined') {
            updatedFields.pagePicturePath = pagePicturePath;
        }
        if (events !== '' && events !== null) {
            updatedFields.events = events;
        }

        const updatedPage = await Page.findByIdAndUpdate(pageId, updatedFields, { new: true });
        console.log(updatedPage);
        res.status(200).json(updatedPage);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Delete/DELETE */
export const deletePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const deletedPage = await Page.findByIdAndDelete(pageId);
        res.status(200).json(deletedPage);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const addEvent = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { events } = req.body; // events: [ { date: '' , name: ''} ]
    console.log(pageId, events);
    const page = await Page.findById(pageId);
    console.log(page);
    page.events = events;
    const updatedPage = await page.save();
    res.status(200).json(updatedPage);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
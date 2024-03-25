import Ad from "../models/Ad.js";

export const createAd = async (req, res) => {
    try {
        const { companyname, companywebsite, description, email, picture } = req.body;
        const newAd = new Ad({
            companyname,
            companywebsite,
            description,
            email,
            picture,
        });
        await newAd.save();
        res.status(201).json(newAd);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};
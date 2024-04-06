import axios from 'axios';

export const verifyCaptcha = async (req, res) => {
    try {
        const { token } = req.body;
        const secret = process.env.SITE_SECRET;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
        const response = await axios.post(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const bcrypt = require('bcrypt');
require('dotenv').config();
//const { SECRET_KEY, SALT } = process.env;

SECRET_KEY= "harshika";
SALT="harshika";
const schemaValidate = zod.string().email();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};

const signup = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({ message: 'User already exists' });
        }
        const mail = req.body.email;
        const check = schemaValidate.safeParse(mail);
        if (check.success) {
            const salt = await bcrypt.genSalt(Number(SALT));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({ ...req.body, password: hashedPassword }).save();
    
            const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });
            res.status(201).send({ user: newUser, token });
        } else {
            res.status(400).json({
              message: "Invalid email format",
              details: {
                email: "Email address is not valid",
              },
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};

const authenticateJWT = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(403).json({ message: 'Authentication failed: Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const userProfile = (req, res) => {
    // Access user information from req.user if needed
    const user = req.user;
    // Render the profile page or send relevant data
    res.json({ message: 'User profile accessed successfully!', user });
};

module.exports = {
    login,
    signup,
    userProfile,
    authenticateJWT,
};

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};


// Register User
exports.registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login User
exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });

        } else {

            res.status(401).json({
                message: "Invalid email or password"
            });

        }

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get All Users
exports.getUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Update User
exports.updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();

        res.json(updatedUser);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete User
exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        await user.deleteOne();

        res.json({
            message: "User removed"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
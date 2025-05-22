const User = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '5d' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const userName = user.name;
        const token = createToken(user._id);
        res.status(200).json({ userName, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.signup(name, email, password);
        const userName = user.name;
        const token = createToken(user._id);
        res.status(200).json({ userName, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { name, email, newEmail } = req.body;

    try {
        if (!name || !email || !newEmail) {
            throw Error('Toate câmpurile trebuie completate');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw Error('Utilizatorul nu a fost găsit');
        }

        if (user.name === name && user.email === newEmail) {
            throw Error('Nu s-au detectat modificări');
        }

        if (!validator.isEmail(newEmail)) {
            throw Error('Emailul nou nu este valid');
        }

        if (user.email !== newEmail) {
            const exists = await User.findOne({ email: newEmail });
            if (exists) {
                throw Error('Emailul este deja folosit de un alt cont');
            }
        }

        user.name = name;
        user.email = newEmail;
        const updatedUser = await user.save();

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    const { email, newPassword, newConfirmPassword } = req.body;

    try {
        if (!email || !newPassword || !newConfirmPassword) {
            throw Error('Toate câmpurile trebuie completate');
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw Error('Parola nu este suficient de puternică');
        }

        if (newPassword !== newConfirmPassword) {
            throw Error('Parolele nu se potrivesc');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw Error('Emailul nu a fost găsit');
        }

        const match = await bcrypt.compare(newPassword, user.password);
        if (match) {
            throw Error('Nu poți folosi aceeași parolă ca înainte');
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        user.password = hashed;
        const updatedUser = await user.save();

        res.status(200).json({ success: true, email: updatedUser.email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    signupUser,
    updateUser,
    updatePassword
};

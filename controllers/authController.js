import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'User exists' });
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, password: hash });
return res.status(201).json({ message: 'Registered', userId: user._id });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};


export const login = async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'All fields required' });
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid creds' });
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: 'Invalid creds' });
const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};
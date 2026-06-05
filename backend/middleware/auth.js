const jwt = require('jwt-simple');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization denied, no token provided' });
        }

        const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.decode(token, secret);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token', error: err.message });
    }
};

const companyMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'company') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Companies only' });
    }
};

module.exports = { authMiddleware, companyMiddleware };

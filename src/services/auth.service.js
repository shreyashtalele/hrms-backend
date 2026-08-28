import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { config } from '../config/env.js';

const generateTokens = (userId, role) => {
    const accessToken = jwt.sign(
        { userId, role },
        config.JWT_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId, role },
        config.JWT_REFRESH_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
        throw new Error('Account is inactive');
    }

    const tokens = generateTokens(user._id, user.role);

    return {
        user: {
            id: user._id,
            employeeId: user.employeeId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        },
        tokens,
    };
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { refreshTokenVersion: 1 },
    });
    return { message: 'Logged out successfully' };
};
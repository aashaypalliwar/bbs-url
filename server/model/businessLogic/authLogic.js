const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../dbModel/userModel');
const AppError = require('../../utils/appError');
const config = require('../../utils/config');

const signToken = id => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};


const protect = async (req, res, next) => {
    try{
        // 1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        // if(!(req.cookie.jwt))
        //     return next(
        //         new AppError('You are not logged in! Please log in to get access.', 401)
        //     );
        //token = req.cookie.jwt;

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }

        // // 4) Check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //     return next(
        //         new AppError('User recently changed password! Please log in again.', 401)
        //     );
        // }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    }
    catch(err){
        next(err);
    }
};

module.exports = {
    signToken,
    createSendToken,
    protect
};



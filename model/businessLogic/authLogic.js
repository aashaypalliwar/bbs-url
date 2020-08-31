const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../dbModel/userModel');
const AppError = require('../../utils/appError');
const config = require('../../utils/config');
const sendEmail = require('../../utils/sendEmail');

const signToken = id => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
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

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

const forgotPassword = async (req, res, next) => {
    try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email

    const message = `Forgot your password? Enter this One Time Token in the prompt with your new password and passwordConfirm to reset.\n${resetToken}\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
    });

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
};

const resetPassword = async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
};

const updatePassword = async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
};


module.exports = {
    signToken,
    createSendToken,
    protect,
    restrictTo,
    updatePassword,
    resetPassword,
    forgotPassword
};



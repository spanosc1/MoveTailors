const router = require('express').Router();
const User = require('../models/platformUser');
const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const { sendEmail } = require('../utils/sendEmail');

const SECRET = process.env.SECRET;

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        const token = createJWT(user);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
);

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ err: 'bad credentials' });
        user.comparePassword(req.body.pw, (err, isMatch) => {
            if (isMatch) {
                const token = createJWT(user);
                res.json({ token });
            } else {
                return res.status(400).json({ err: 'bad credentials' });
            }
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}
);

router.post('/reset-link', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

            user.generatePasswordReset();
            user.save()
                .then(user => {
                    let link = process.env.RESET_PASSWORD_URL + user.resetPasswordToken;
                    const data = {
                        to: user.email,
                        from: process.env.FROM_EMAIL,
                        subject: 'Move Tailers Co. - Password Reset',
                        text: `text`,
                        html: `<div>Hi ${user.firstName} ${user.lastName}</div><br/>\n 
                        <div>Please click on the following link ${link} to reset your password</div><br/>. \n\n 
                        <div>If you did not request this, please ignore this email and your password will remain unchanged</div><br/>.\n`,
                    };

                    sgMail.send(data, (error, result) => {
                        if (error) return res.status(500).json({ message: error.message });
                        res.status(200).json({ message: 'A reset email has been sent to ' + user.email + '.' });
                    });
                })
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
});


router.post('/reset-link/update-password', (req, res) => {
    User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } })
        .then((user) => {
            if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
                if (err) return res.status(500).json({ message: err.message });
                res.status(200).json({ message: 'Your password has been updated.' });
            });
        });
});


/*---  Helper Functions ---*/
function createJWT(user) {
    return jwt.sign(
        { user },  // data payload
        SECRET,
        { expiresIn: '24h' }
    );
}


module.exports = router;


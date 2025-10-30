import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getUserByEmail } from '../DatabaseCode/databaseQueries.js';
dotenv.config();

const router = express.Router()

router.post('/requestPasswordReset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            // respond same message even if user doesn't exist
            return res.status(200).send({ message: "If the email exists, a reset link has been sent." });
        }

        // generate reset token (valid for 15 minutes)
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.RESET_TOKEN_EXPIRY || '15m' });

        // create reset link
        const resetLink = `${process.env.RESET_LINK_BASE}?token=${token}`;

        // send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "If the email exists, a reset link has been sent." });

    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

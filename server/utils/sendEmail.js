const nodemailer = require('nodemailer');

// Initialize transporter outside to reuse connection
let transporter;

const createTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        transporter = nodemailer.createTransport({
            pool: true, // Keep connections open
            maxConnections: 3,
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, text) => {
    try {
        const mailTransport = await createTransporter();

        const info = await mailTransport.sendMail({
            from: '"Kodbank Security" <security@kodbank.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: `<b>${text}</b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        // Preview only available when sending through an Ethereal account
        if (!process.env.MAIL_USER) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;

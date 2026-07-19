import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    //creating transporter
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    //email options
    const mailOptions = {
        from: `"ApplyFlow " <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions); //nodemailer sendMail inbuilt function
};

export default sendEmail;
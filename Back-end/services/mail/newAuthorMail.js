import nodemailer from "nodemailer";

export const newAuthorMail = async (sendTo, mailBody) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'martine.ferry@ethereal.email',
            pass: '7BxKM2tbkteEkDbcRX'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const mail = await transporter.sendMail({
            from: "<martine.ferry@ethereal.email>",
            to: sendTo || "<martine.ferry@ethereal.email>",
            subject: "New author page created",
            text: mailBody || "A new author page has been created."
        });

        console.log("Email sent:", mail.response);
    } catch (err) {
        console.error("Error sending email:", err)
    }
}
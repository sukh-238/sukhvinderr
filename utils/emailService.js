import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST,
port: Number(process.env.EMAIL_PORT) || 465,
secure: true,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});


export const sendDownloadEmail = async (toEmail, name, link, filename) => {
const info = await transporter.sendMail({
from: `FileShare <${process.env.EMAIL_USER}>`,
to: toEmail,
subject: 'Your file is ready to download',
html: `
<p>Hi ${name},</p>
<p>Your file <strong>${filename}</strong> is uploaded. Use the link below to download. It expires in 1 hour.</p>
<p><a href="${link}">Download file</a></p>
<p>If you didn't request this, ignore.</p>
`
});
return info;
};
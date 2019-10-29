import { createTransport } from 'nodemailer';

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

interface EmailInput {
  to: string;
  subject: string;
  message: string;
}

const logoWidth = 432;
const logoHeight = 156;

export const sendEmail = ({to, subject, message}: EmailInput) => {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to,
    subject,
    html: `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <img src="" width="${logoWidth * 0.6}" height="${logoHeight * 0.6}" />
      <h1>${subject}</h1>
      <p>${message}</p>
      <a href="https://www.wilderlist.app/">
        Log-in to Wilderlist
      </a>
    </div>
    `,
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

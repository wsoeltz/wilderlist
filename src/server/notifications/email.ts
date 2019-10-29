import { createTransport } from 'nodemailer';
import ascentEmailTemplate, {
  TemplateInput as AscentTemplateContent,
} from './emailTemplates/ascentEmail';

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendAscentEmailNotification = (input: AscentTemplateContent) => {
  const {
    mountainName, user, userEmail, date,
  } = input;
  const mailOptions = {
    from: `Wilderlist <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: `${user} marked you as hiking ${mountainName} on ${date}`,
    html: ascentEmailTemplate(input),
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

import { createTransport } from 'nodemailer';
import ascentEmailTemplate, {
  TemplateInput as AscentTemplateContent,
} from './emailTemplates/ascentEmail';
import ascentInviteEmailTemplate from './emailTemplates/ascentInviteEmail';
import welcomeEmailTemplate from './emailTemplates/welcomeEmail';

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
  const firstName = user.split(' ').shift();
  const mailOptions = {
    from: `${firstName} via Wilderlist <${process.env.GMAIL_USERNAME}>`,
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

export const sendAscentInviteEmailNotification = (input: AscentTemplateContent) => {
  const {
    mountainName, user, userEmail, date,
  } = input;
  const firstName = user.split(' ').shift();
  const mailOptions = {
    from: `${firstName} via Wilderlist <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: `${user} marked you as hiking ${mountainName} on ${date}`,
    html: ascentInviteEmailTemplate(input),
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

export const sendWelcomeEmail = (userEmail: string) => {
  const mailOptions = {
    from: `Kyle via Wilderlist <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: `Welcome to Wilderlist!`,
    html: welcomeEmailTemplate(userEmail),
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

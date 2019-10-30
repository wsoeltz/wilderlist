import { createTransport } from 'nodemailer';
import acceptFriendRequestEmailTemplate from './emailTemplates/acceptFriendRequestEmail';
import ascentEmailTemplate, {
  TemplateInput as AscentTemplateContent,
} from './emailTemplates/ascentEmail';
import ascentInviteEmailTemplate from './emailTemplates/ascentInviteEmail';
import friendRequestEmailTemplate from './emailTemplates/friendRequestEmail';
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

export const sendFriendRequestEmailNotification = (
  {userEmail, userName}: {userEmail: string, userName: string}) => {
  const firstName = userName.split(' ').shift();
  const mailOptions = {
    from: `${firstName} via Wilderlist <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: `${userName} has added you as a friend on Wilderlist`,
    html: friendRequestEmailTemplate({userName, userEmail}),
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

export const sendAcceptFriendRequestEmailNotification = (
  {userEmail, userName, userId}: {userEmail: string, userName: string, userId: string}) => {
  const firstName = userName.split(' ').shift();
  const mailOptions = {
    from: `${firstName} via Wilderlist <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: `${userName} is now your friend on Wilderlist`,
    html: acceptFriendRequestEmailTemplate({userName, userEmail, userId}),
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

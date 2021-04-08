/* eslint-disable max-len */
/* tslint:disable:max-line-length */

export interface TemplateInput {
  mountainName: string;
  user: string;
  userEmail: string;
  date: string;
  camping?: boolean;
}

export default (input: TemplateInput) => {
  const {
    mountainName, user, userEmail, date, camping,
  } = input;
  const actionText = camping ? 'camping at' : 'hiking';
  return `
  <div style="max-width: 450px; margin: auto;font-family: Arial, sans-serif; line-height: 1.4;color: #333333;">
    <div style="text-align: center">
      <img style="max-width: 250px; display:inline-block;" src="https://www.wilderlist.app/wilderlist-logo.png" />
    </div>
    <h1 style="text-align: center;font-size: 20px;">Create an account on Wilderlist to start tracking your hiking progress</h1>
    <p style="font-size: 17px;line-height: 1.7;"><strong>${user}</strong> marked you as ${actionText} <strong>${mountainName}</strong> on <strong>${date}</strong>. Sign up for a free account with Wilderlist to start tracking and sharing your progress towards the New Hampshire 4000 Footers, Adirondack 46, 52 with a View, New England 100 Highest, and more.</p>
    <div style="text-align: center;">
      <a href="https://www.wilderlist.app/" style="display: inline-block;padding: 8px 18px;border-radius: 4px;color:#fff;background-color:#668434;text-decoration: none;">
        Sign up with Wilderlist today
      </a>
    </div>
    <img style="max-width: 100%; margin-top: 60px;" src="https://www.wilderlist.app/mountain-range.png" />
    <hr style="margin-top: 20px;"/>
    <div style="color: #7c7c7c; padding: 10px; text-align: center; margin-top: 20px; line-height: 1.5;">
      <p style="font-size: 12px">
        393 Broadway, Cambridge, MA 02139 | 508-517-6476
        <br /><a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a> | <a href="mailto:help@wilderlist.app" style="color:#2b5b37;">help@wilderlist.app</a>
        <br />
        <br />This message was sent to <a href="mailto:${userEmail}" style="color:#2b5b37;">${userEmail}</a> by <a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a>.
        <br />This is a one time email sent to you as a result of a Wilderlist user adding you to one of their trips. Your email has not been saved to any mailing lists.
        <br >Should you sign up for a Wilderlist account, you can unsubscribe from email notifications <a href="https://www.wilderlist.app/user-settings" style="color:#2b5b37;">through your settings here</a>.
      </p>
    </div>
  </div>
  `;
};

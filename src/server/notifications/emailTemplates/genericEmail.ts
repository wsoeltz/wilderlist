/* tslint:disable:max-line-length */

export interface GenericEmailNotificationInput {
  userEmail: string;
  subject: string;
  title: string;
  content: string;
  ctaText: string;
  ctaLink: string;
}

export default (input: GenericEmailNotificationInput) => {
  const {
    userEmail, title, content, ctaText, ctaLink,
  } = input;
  return `
  <div style="max-width: 450px; margin: auto;font-family: Arial, sans-serif; line-height: 1.4;color: #333333;">
    <div style="text-align: center">
      <img style="max-width: 250px; display:inline-block;" src="https://www.wilderlist.app/wilderlist-logo.png" />
    </div>
    <h1 style="text-align: center;font-size: 28px;">${title}</h1>
    <div style="font-size: 17px;line-height: 1.7;">${content}</div>
    <div style="text-align: center;">
      <a href="${ctaLink}" style="display: inline-block;padding: 8px 18px;border-radius: 4px;color:#fff;background-color:#668434;text-decoration: none;">
        ${ctaText}
      </a>
    </div>
    <img style="max-width: 100%; margin-top: 60px;" src="https://www.wilderlist.app/mountain-range.png" />
    <hr style="margin-top: 20px;"/>
    <div style="color: #7c7c7c; padding: 10px; text-align: center; margin-top: 20px; line-height: 1.5;">
      <p style="font-size: 12px">
        393 Broadway, Cambridge, MA 02139 | 508-517-6476
        <br /><a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a> | <a href="mailto:wilderlistapp@gmail.com" style="color:#2b5b37;">wilderlistapp@gmail.com</a>
        <br />
        <br />This message was sent to <a href="mailto:${userEmail}" style="color:#2b5b37;">${userEmail}</a> by <a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a>.
        <br ><a href="https://www.wilderlist.app/user-settings" style="color:#2b5b37;">Unsubscribe through your Wilderlist account here</a>.
      </p>
    </div>
  </div>
  `;
};

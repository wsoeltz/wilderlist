/* eslint-disable max-len */
/* tslint:disable:max-line-length */
export default (userEmail: string) => {
  return `
  <div style="max-width: 450px; margin: auto;font-family: Arial, sans-serif; line-height: 1.4;color: #333333;">
    <div style="text-align: center">
      <img style="max-width: 250px; display:inline-block;" src="https://www.wilderlist.app/wilderlist-logo.png" />
    </div>
    <h1 style="text-align: center;font-size: 28px;">Welcome to Wilderlist
    </h1>
    <p style="font-size: 17px;line-height: 1.7;">Thank you for joining us! Now you can start tracking and sharing your hiking progress today.</p>
    <div style="text-align: center;">
      <a href="https://www.wilderlist.app/" style="display: inline-block;padding: 8px 18px;border-radius: 4px;color:#fff;background-color:#668434;text-decoration: none;">
        Open Wilderlist
      </a>
    </div>
    <h3 style="text-align: center;margin-top: 40px;">
      Pro-tip: Import your existing ascents
    </h3>
    <p style="line-height: 1.7;">If you've already been tracking your ascents via spreadsheet, you can copy your data directly into Wilderlist with a quick and easy to use import tool. Just navigate to the list you've been working on and click on the green button just above the list of mountains.</p>
    <h3 style="text-align: center;margin-top: 40px;">
      Compare: Plan your next hike
    </h3>
    <p style="line-height: 1.7;">Add your friends and use the "Compare Ascents" tool on their profile to see what hikes you both have left to do. Make planning your next hike easy!</p>
    <h2 style="text-align: center;">Happy hiking!</h2>
    <h3 style="text-align: center;margin-top: 40px;">
      Questions or Comments?
    </h3>
    <p style="line-height: 1.7;">If you have any questions, comments or feedback you can contact me, Kyle Soeltz, directly at <a href="mailto:kyle@wilderlist.app" style="color:#2b5b37;">kyle@wilderlist.app</a>. I am always looking to make Wilderlist the best tool it can be for the hiking community.</p>
    <img style="max-width: 100%; margin-top: 60px;" src="https://www.wilderlist.app/mountain-range.png" />
    <hr style="margin-top: 20px;"/>
    <div style="color: #7c7c7c; padding: 10px; text-align: center; margin-top: 20px; line-height: 1.5;">
      <p style="font-size: 12px">
        393 Broadway, Cambridge, MA 02139 | 508-517-6476
        <br /><a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a> | <a href="mailto:help@wilderlist.app" style="color:#2b5b37;">help@wilderlist.app</a>
        <br />
        <br />This message was sent to <a href="mailto:${userEmail}" style="color:#2b5b37;">${userEmail}</a> by <a href="https://www.wilderlist.app/" style="color:#2b5b37;">Wilderlist</a>.
        <br ><a href="https://www.wilderlist.app/user-settings" style="color:#2b5b37;">Unsubscribe through your Wilderlist account here</a>.
      </p>
    </div>
  </div>
  `;
};

/* tslint:disable:max-line-length */
import { GetString } from 'fluent-react/compat';
import React, { useContext } from 'react';
import Helmet from 'react-helmet';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentFull,
} from '../../styling/Grid';

const PrivacyPolicy = () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const metaDescription = getFluentString('meta-data-privacy-policy-description');

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-privacy-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getFluentString('meta-data-privacy-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
      </Helmet>
      <ContentFull>
        <ContentBody>
          <h1>{getFluentString('header-text-menu-privacy-policy')}</h1>
          <div>
          <p><small>Last Update: March 6, 2020</small></p>

          <p>It is Wilderlist's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href='https://www.wilderlist.app'>https://www.wilderlist.app</a> (hereinafter, "us", "we", or "https://www.wilderlist.app"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>

          <p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p>

          <h4><strong>Website Visitors</strong></h4>

          <p>Like most website operators, Wilderlist collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Wilderlist's purpose in collecting non-personally identifying information is to better understand how Wilderlist's visitors use its website. From time to time, Wilderlist may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.</p>

          <p>Wilderlist also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users. Wilderlist only discloses logged in user IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.</p>

          <h4><strong>Gathering of Personally-Identifying Information</strong></h4>

          <p>Certain visitors to Wilderlist's websites choose to interact with Wilderlist in ways that require Wilderlist to gather personally-identifying information. The amount and type of information that Wilderlist gathers depends on the nature of the interaction. For example, we ask visitors who create an account at <a href='https://www.wilderlist.app'>https://www.wilderlist.app</a> to log in using a Google, Facebook, or Reddit account.</p>

          <p>When creating an account with one of the above mentioned providers, you give Wilderlist access to your basic profile information which includes data such as your name, email address, profile picture, and account ID. The specific information provided is dependent on the provider and is stated on the provider's consent screen when you log in. Wilderlist only utilizes and stores your name, email address, profile picture, and account ID.</p>

          <h4><strong>Display of Personal Information</strong></h4>

          <p>Your personal information is primarily used to identify you throughout the use of Wilderlist. Other users with an account may search for your Wilderlist account and see your name, email address, profile picture, and hiking related data that has been accrued in Wilderlist.</p>

          <p>You may at any time disable all or some of your information from being publicly visible within the Settings menu.</p>

          <p>Your name and profile account will be accessible to all users, logged in or not, when associated with a trip report, comment, hiking list, or other content in which you are responsible for contributing to Wilderlist. You may change in the settings to have your name and profile hidden. The content will still remain publicly visible, but your name and profile account will remain anonymous.</p>

          <h4><strong>Security</strong></h4>

          <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>

          <h4><strong>Links To External Sites</strong></h4>

          <p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.</p>

          <p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p>

          <h4><strong>Protection of Certain Personally-Identifying Information</strong></h4>

          <p>Wilderlist discloses potentially personally-identifying and personally-identifying information only to those of its employees, contractors and affiliated organizations that (i) need to know that information in order to process it on Wilderlist's behalf or to provide services available at Wilderlist's website, and (ii) that have agreed not to disclose it to others. Some of those employees, contractors and affiliated organizations may be located outside of your home country; by using Wilderlist's website, you consent to the transfer of such information to them. Wilderlist will not rent or sell potentially personally-identifying and personally-identifying information to anyone. Other than to its employees, contractors and affiliated organizations, as described above, Wilderlist discloses potentially personally-identifying and personally-identifying information only in response to a subpoena, court order or other governmental request, or when Wilderlist believes in good faith that disclosure is reasonably necessary to protect the property or rights of Wilderlist, third parties or the public at large.</p>

          <p>If you are a registered user of <a href='https://www.wilderlist.app'>https://www.wilderlist.app</a> and have supplied your email address, Wilderlist may occasionally send you an email to tell you about new features, solicit your feedback, or just keep you up to date with what's going on with Wilderlist and our products. If you send us a request (for example via a support email or via one of our feedback mechanisms), we reserve the right to publish it in order to help us clarify or respond to your request or to help us support other users. Wilderlist takes all measures reasonably necessary to protect against the unauthorized access, use, alteration or destruction of potentially personally-identifying and personally-identifying information.</p>

          <p>You may also receive email notifications for other actions that happen within Wilderlist, such as being tagged on a friend's hike, a new friend request, or other activity with the app. You may disable email notifications at any time in the Settings menu.</p>

          <p>Note that even with email notifications disabled, you will still receive an email in the case of important updates. These kind of updates are infrequent.</p>

          <h4><strong>Deletion Personally-Identifying Information</strong></h4>

          <p>You may at any time contact us at <a href='mailto:help@wilderlist.app'>help@wilderlist.app</a> to request all of your personal information be deleted and it will be permanently removed without undue delay.</p>

          <h4><strong>Aggregated Statistics</strong></h4>

          <p>Wilderlist may collect statistics about the behavior of visitors to its website. Wilderlist may display this information publicly or provide it to others. However, Wilderlist does not disclose your personally-identifying information.</p>

          <h4><strong>Cookies</strong></h4>

          <p>To enrich and perfect your online experience, Wilderlist uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.</p>

          <p>A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. Wilderlist uses cookies to help Wilderlist identify and track visitors, their usage of <a href='https://www.wilderlist.app'>https://www.wilderlist.app</a>, and their website access preferences. Wilderlist visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using Wilderlist's websites, with the drawback that certain features of Wilderlist's websites may not function properly without the aid of cookies.</p>

          <p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to Wilderlist's use of cookies.</p>

          <h4><strong>Privacy Policy Changes</strong></h4>

          <p>Although most changes are likely to be minor, Wilderlist may change its Privacy Policy from time to time, and in Wilderlist's sole discretion. Wilderlist encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>

          <h3>Credit &amp; Contact Information</h3>

          <p><small>This privacy policy was created in part and with the aid of <a href='https://privacytermsgenerator.com/' title='Privacy policy template generator' target='_blank' rel='noopener noreferrer'>privacytermsgenerator.com</a>. If you have any questions about this Privacy Policy, please contact us via <a href='mailto:help@wilderlist.app'>help@wilderlist.app</a>.</small></p>

          </div>
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default PrivacyPolicy;

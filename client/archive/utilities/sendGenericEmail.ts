import axios from 'axios';

interface Params {
  emailList: string[];
  subject: string;
  title: string;
  content: string;
  ctaText: string;
  ctaLink: string;
}

const sendGenericEmail = (input: Params) => {
  const {
    emailList, subject, title,
    content, ctaText, ctaLink,
  } = input;
  emailList.forEach((email) => {
    axios.get('/api/send-email', {
      params: {
        userEmail: email, subject, title,
        content, ctaText, ctaLink,
      },
    })
    .catch(function(error) {
      console.error(error);
    });
  });
};

export default sendGenericEmail;

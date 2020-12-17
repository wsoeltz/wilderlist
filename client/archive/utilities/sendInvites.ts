import axios from 'axios';

interface Params {
  mountainName: string;
  emailList: string[];
  date: string;
}

const sendInvites = (input: Params) => {
  const {
    mountainName, emailList, date,
  } = input;
  emailList.forEach((email) => {
    axios.get('/api/ascent-invite', {
      params: {
        email, mountainName, date,
      },
    })
    .catch(function(error) {
      console.error(error);
    });
  });
};

export default sendInvites;

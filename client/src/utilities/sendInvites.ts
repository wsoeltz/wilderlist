import axios from 'axios';

interface Params {
  mountainName: string;
  emailList: string[];
  date: string;
  camping: boolean;
}

const sendInvites = (input: Params) => {
  const {
    mountainName, emailList, date, camping,
  } = input;
  emailList.forEach((email) => {
    axios.get('/api/ascent-invite', {
      params: {
        email, mountainName, date, camping,
      },
    })
    .catch(function(error) {
      console.error(error);
    });
  });
};

export default sendInvites;

require('dotenv/config');

const axios = require('axios');

const apiUrl = process.env.API_URL;

const getList = async () => {
  try {
    const resp = await axios.get(`${apiUrl}/tags`);
    return resp.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('> Não existe tags cadastradas!');
  }

  return [];
};

const addTagList = async (tagList) => {
  tagList.forEach((tag) => {
    const tagObject = { tag };
    axios.post(`${apiUrl}/tags`, tagObject);
  });
};

module.exports = {
  getList,
  addTagList,
};

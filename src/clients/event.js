require('dotenv/config');

const moment = require('moment');

moment.locale('pt-br');

const axios = require('axios');

// const credentialApiUrl = require('../credentials/api.json').url;
const apiUrl = process.env.API_URL;

const listEventsTags = (events) => {
  const allTags = [];

  events.forEach((event) => {
    allTags.push(...event.tags);
  });

  const uniqueTags = [...new Set(allTags)];

  return uniqueTags;
};

const listEvents = async () => {
  try {
    const resp = await axios.get(`${apiUrl}/events?currentEvents=true`);
    return resp.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('> Não existe eventos cadastrados!');
  }

  return [];
};

const findByTag = async (tag) => {
  try {
    const resp = await axios.get(`${apiUrl}/events?tag=${tag}`);
    return resp.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`> Não existe evento com a tag '${tag}'!`);
  }

  return [];
};

const toString = (event) => {
  let eventMsg = `${moment(event.startDate).format('LLLL')} até às ${moment(event.endDate).format('LT')} `;
  eventMsg += `terá o evento '${event.summary}' `;
  eventMsg += `(<b>${moment(event.startDate).fromNow()}</b>)`;
  eventMsg += `\n\n<b>Local</b>: ${event.place}`;
  eventMsg += `\n<b>Endereço:</b> ${event.address}`;

  return eventMsg;
};

module.exports = {
  listEventsTags,
  listEvents,
  findByTag,
  toString,
};

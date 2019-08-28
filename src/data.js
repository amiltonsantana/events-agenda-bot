require('dotenv/config');

const fs = require('fs');
const redis = require('redis');

let redisClient = null;

if (process.env.REDIS_ENABLED) {
  redisClient = redis.createClient(process.env.REDIS_URL);
}

const DATA_PATH = './data';

if (redisClient) {
  redisClient.on('error', (err) => {
    console.log(`> Redis Error: ${err}`);
  });
}

const saveJsonObject = (content, filePath) => {
  if (process.env.REDIS_ENABLED) {
    redisClient.set(filePath, content);
    redisClient.expire(filePath, 600);
  } else {
    const contentString = JSON.stringify(content);
    fs.writeFileSync(filePath, contentString);
  }
};

const loadJsonObject = (filePath) => {
  if (process.env.REDIS_ENABLED) {
    redisClient.get(filePath, (err, res) => {
      if (res) {
        redisClient.expire(filePath, 600);
        return res;
      }
      return false;
    });
  } else if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileBuffer);
  }
  return false;
};

const saveUserState = (userState, userId, charId) => {
  saveJsonObject(userState, `${DATA_PATH}/${userId}-${charId}-state.json`);
};

const loadUserState = (userId, chatId) => loadJsonObject(`${DATA_PATH}/${userId}-${chatId}-state.json`);

const getTagList = () => {
  const tagList = loadJsonObject(`${DATA_PATH}/tags.json`);
  if (tagList) {
    return tagList;
  }
  return [];
};

const saveTagList = (tagList) => {
  saveJsonObject(tagList, `${DATA_PATH}/tags.json`);
};

module.exports = {
  saveUserState,
  loadUserState,
  getTagList,
  saveTagList,
};

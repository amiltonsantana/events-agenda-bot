require('dotenv/config');

require('./server/server');

const publicAgendaBot = require('./bot');

publicAgendaBot();

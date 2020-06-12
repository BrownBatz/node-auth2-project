const knex = require('knex');

const configFile = require('./knexfile');

const db = knex(configFile.development);

module.exports = db;
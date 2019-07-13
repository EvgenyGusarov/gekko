const _ = require('lodash');
const fs = require('fs');

const util = require('../../core/util.js');
const config = util.getConfig();
const dirs = util.dirs();

const log = require(util.dirs().core + 'log');
const postgresUtil = require('./util');

const adapter = config.postgresql;

// verify the correct dependencies are installed
const pluginHelper = require(dirs.core + 'pluginUtil');
const pluginMock = {
  slug: 'postgresql adapter',
  dependencies: config.postgresql.dependencies
}

const cannotLoad = pluginHelper.cannotLoad(pluginMock);
if(cannotLoad) {
  util.die(cannotLoad);
}

const pg = require('pg');

const dbName = postgresUtil.database();

const connectionString = config.postgresql.connectionString;

const pool = new pg.Pool({
  connectionString: connectionString + '/' + dbName,
});


module.exports = pool;

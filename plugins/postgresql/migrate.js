const _ = require('lodash');

const util = require('../../core/util.js');
const postgresUtil = require('./util');
const log = require(util.dirs().core + 'log');
const pool = require('./handle');


const upsertTables = () => {
  const upsertQuery =
    `CREATE TABLE IF NOT EXISTS
    ${postgresUtil.table('candles')} (
      id BIGSERIAL PRIMARY KEY,
      start integer UNIQUE,
      open double precision NOT NULL,
      high double precision NOT NULL,
      low double precision NOT NULL,
      close double precision NOT NULL,
      vwp double precision NOT NULL,
      volume double precision NOT NULL,
      trades INTEGER NOT NULL
    );`;

  log.debug('\n' + upsertQuery);

  pool.query(upsertQuery, (err) => {
    if(err) {
      util.die(err);
    }
  });
}

module.exports = upsertTables;

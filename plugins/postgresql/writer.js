var _ = require('lodash');
const log = require('../../core/log');
const util = require('../../core/util');
const config = util.getConfig();

var handle = require('./handle');
var postgresUtil = require('./util');

var Store = function(done, pluginMeta) {
  _.bindAll(this);
  this.done = done;
  this.db = handle;
  this.cache = [];
  done();
}

Store.prototype.writeCandles = function(next) {
  console.log('writeCandles', this.cache);
  if(_.isEmpty(this.cache)){
    return next();
  }

  //log.debug('Writing candles to DB!');
  _.each(this.cache, candle => {
    var stmt =  `
    BEGIN; 
    LOCK TABLE ${postgresUtil.table('candles')} IN SHARE ROW EXCLUSIVE MODE; 
    INSERT INTO ${postgresUtil.table('candles')} 
    (start, open, high,low, close, vwp, volume, trades) 
    VALUES 
    (${candle.start.unix()}, ${candle.open}, ${candle.high}, ${candle.low}, ${candle.close}, ${candle.vwp}, ${candle.volume}, ${candle.trades}) 
    ON CONFLICT ON CONSTRAINT ${postgresUtil.startconstraint('candles')} 
    DO NOTHING; 
    COMMIT; 
    `;

    this.db.connect((err,client,done) => {
      if(err) {
        util.die(err);
      }
      client.query(stmt, (err, res) => {
        done();
        if (err) {
          log.debug(err.stack)
        } else {
          //log.debug(res)
        }
        next();
      });
    });
  });

  this.cache = [];
}

var processCandle = function(candle, done) {
  this.cache.push(candle);
  if (this.cache.length > 1)
    this.writeCandles(done);
  else
    done();
};

var finalize = function(done) {
  console.log('finalize');
  this.writeCandles(() => {
    this.db = null;
    done();
  });
}

if(config.candleWriter.enabled) {
  Store.prototype.processCandle = processCandle;
  Store.prototype.finalize = finalize;
}

module.exports = Store;

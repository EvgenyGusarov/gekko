/*

  MACD - DJM 31/12/2013

  (updated a couple of times since, check git history)

 */

// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  // how many candles do we need as a base
  // before we can start giving advice?
  this.requiredHistory = this.tradingAdvisor.historySize; // must be at least 25

  this.state = {
    diff: null
  };

  // define the indicators we need
  this.addIndicator('sma7', 'SMA', 7);
  this.addIndicator('sma25', 'SMA', 25);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  var digits = 8;
  var sma7 = this.indicators.sma7;
  var sma25 = this.indicators.sma25;
  var diff = sma7.result - sma25.result;

  log.debug('calculated SMA properties for candle:');
  log.debug('\t', 'sma7:', sma7.result.toFixed(digits));
  log.debug('\t', 'sma25:', sma25.result.toFixed(digits));
  log.debug('\t', 'diff:', diff.toFixed(digits));
};

method.check = function() {
  var diff = this.indicators.sma7.result - this.indicators.sma25.result;

  // TODO: threshold
  if (diff > 0 && this.state.diff < 0) {
    this.advice('long');
  } else if (diff < 0 && this.state.diff > 0) {
    this.advice('short');
  }

  this.state.diff = diff;
};

module.exports = method;

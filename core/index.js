const Blockchain    = require('./blockchain');
const transaction   = require('./transaction');
const modules       = {};

modules.Blockchain  = Blockchain;
modules.transaction = transaction;

module.exports      = modules;
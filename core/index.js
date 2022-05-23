const Blockchain    = require('./blockchain');
const transaction   = require('./transaction');
const wallet        = require('./wallet');
const modules       = {};

modules.Blockchain  = Blockchain;
modules.transaction = transaction;
modules.wallet      = wallet;

module.exports      = modules;
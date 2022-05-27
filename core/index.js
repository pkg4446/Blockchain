const bank          = require('./bank');
const blockchain    = require('./blockchain');
const encryption    = require('./encryption');
const transaction   = require('./transaction');
const modules       = {};

modules.bank        = bank;
modules.blockchain  = blockchain;
modules.encryption  = encryption;
modules.transaction = transaction;

const wallet        = require('./wallet');
const walletMake    = new wallet()

module.exports      = modules;
const bank          = require('./bank');
const blockchain    = require('./blockchain');
const encryption    = require('./encryption');
const transaction   = require('./transaction');
const validation    = require('./validation');
const wallet        = require('./wallet');
const modules       = {};

const walletMake    = new wallet()

modules.bank        = bank;
modules.blockchain  = blockchain;
modules.encryption  = encryption;
modules.transaction = transaction;
modules.validation  = validation;
modules.wallet      = wallet;

module.exports      = modules;
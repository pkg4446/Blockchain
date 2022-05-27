const Blockchain    = require('./blockchain');
const encryption    = require('./encryption');
const transaction   = require('./transaction');
const modules       = {};

modules.Blockchain  = Blockchain;
modules.encryption  = encryption;
modules.transaction = transaction;

const wallet        = require('./wallet');
const walletMake    = new wallet()

module.exports      = modules;
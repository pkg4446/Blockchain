const {bank}    = require('../core');

createBlock     = setInterval(async function() {
    bank.newBlock();  
}, 1000*60*1);

const {bank}    = require('../core');
const thread    = require('../thread');

let validationResult    = true;
createBlock     = setInterval(async function() {
    if(validationResult){
        const creat = await bank.newBlock();  
        validationResult    = thread.test(creat);
    }  
}, 1000*15);

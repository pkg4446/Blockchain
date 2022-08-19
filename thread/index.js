const { Worker} = require('worker_threads');
const validate  = new Worker('./thread/validate.js');
const store     = new Worker('./thread/store.js');

let validationResult    = true;
validate.on('message', message => {
    validationResult    = message;
});

exports.test = function(creat){
    try {
        validate.postMessage(creat);
    } catch (error) {
        console.log(error);
    }    
    return validationResult;
};
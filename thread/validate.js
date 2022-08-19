const {parentPort}  = require('worker_threads');
const {validation}  = require('../core');

let validationFlage     = false;
let validationResult    = true;
parentPort.on('message', message => {
    validationFlage     = message;
});

validate    = setInterval(function() {
    try {
        if(validationFlage){
            validationFlage  = false;
            validationResult = validation.getBlock(); 
        }             
        parentPort.postMessage(validationResult);  
    } catch (error) {
        console.log(error);
    }       
}, 1000*60*60*24);
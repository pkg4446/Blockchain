const {validation}  = require('../core');

validate            = setInterval(async function() {
    try {
        validation.getBlock();                
    } catch (error) {
        console.log(error);
    }       
}, 1000*60*1);
const   record  = require('../core/record');

storage = setInterval(function() {
    record.backUp();
}, 1000*60);
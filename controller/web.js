const   fs          = require('fs');
const   webForder   = 'views/';

exports.view = async function(page){
    try {
        const html  = fs.readFileSync(webForder + page, 'utf8');
        return html.toString();
    } catch (error) {
        return "404 Not Found";
    }    
};
const {bank,wallet}    = require('../core');

const http        = require('http');
const url         = require('url');

const app   = http.createServer(function(request,response){
    let queryData = url.parse(request.url, true).query;
    if(request.url == '/favicon.ico'){
        return response.writeHead(404);   
    }
    if(request.url == '/'){
        let body = '';
        request.on('data', function(data){
            body += data;
            if(body.length > 1e6) request.destroy();
        });
        request.on('end', function () {
            let post = JSON.parse(body);
            POST(response,post);
        });
    }     
});
app.listen(3001);

async function POST(response,data){
    const TYPE      =   data.TYPE;
    const KEY       =   data.KEY;
    const WALLET    =   data.WALLET;
    const AMOUNT    =   data.AMOUNT;
    const TransactionDATA = {
        privateKey: KEY,
        publicKey:  WALLET,
        amount:     AMOUNT,
    }
    const res = {
        result : true,
        text   : '',
    };
    switch (TYPE) {
        case 'minting':
            bank.minting(AMOUNT);
            break;
        case 'burn':
            bank.burn(AMOUNT);
            break;
        case 'transaction':            
            bank.remittance(TransactionDATA);
            break;
        case 'wallet':
            bank.Balance(WALLET);
            break;
        case 'airDrop':            
            const walletMake    = new wallet()
            if(KEY == walletMake.getPrivate())
                res.text = bank.airDrop(TransactionDATA);
            break;
        case 'makeNewBlock':
            bank.newBlock();
            break;
        default:
            break;
    }
    response.writeHead(200);
    response.write(JSON.stringify(res));
    response.end();
}
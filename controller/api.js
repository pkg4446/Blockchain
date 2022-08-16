const {bank,wallet} = require('../core');
const web           = require('./web');

const http        = require('http');

const app   = http.createServer(async function(request,response){
    if(request.url == '/favicon.ico'){
        return response.writeHead(404);   
    }
    if(request.url == '/'){        
        const webpage = await web.view('index.html');
        response.writeHead(200);
        response.write(webpage);
        response.end();
    }
    if(request.url == '/api'){
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
        data   : null,
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
            res.data = await bank.Balance(WALLET);
            break;
        case 'myWallet':            
            res.data = await bank.getPublicKey(KEY); 
            break;
        case 'airDrop':            
            const walletMake    = new wallet()
            if(KEY == walletMake.getPrivate())
                res.data = await bank.airDrop(WALLET,AMOUNT);
            break;
        case 'createNewBlock':            
            bank.newBlock(); 
            break;        
        default:
            res.result = false;
            break;
    }
    response.writeHead(200);
    response.write(JSON.stringify(res));
    response.end();
}
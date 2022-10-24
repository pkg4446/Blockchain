const {bank,wallet} = require('../core');
const web           = require('./web');

const http          = require('http');

const app   = http.createServer(async function(request,response){
    let webpage;
    if(request.url == '/favicon.ico'){
        return response.writeHead(404);   
    }
    switch (request.url) {
        case '/api':
            let body = '';
            request.on('data', function(data){
                body += data;
                if(body.length > 1e6) request.destroy();
            });
            request.on('end', function () {
                let post = JSON.parse(body);
                POST(response,post);
            });
            break;   
        case '/mainBank':
            webpage = await web.view('admin.html');
            response.writeHead(200);
            response.write(webpage);
            response.end();
            break;       
        default:
            webpage = await web.view('index.html');
            response.writeHead(200);
            response.write(webpage);
            response.end();
            break;
    }
});

app.listen(3333);

async function POST(response,data){
    const decimalPoint  = await bank.decimalPoint();
    const TYPE      =   data.TYPE;
    const KEY       =   data.KEY;
    const WALLET    =   data.WALLET;
    const AMOUNT    =   Math.round(data.AMOUNT* decimalPoint) / decimalPoint;

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
            if(AMOUNT){
                res.data = await bank.minting(AMOUNT);
            }else{
                res.result  = false;
                res.data    = "Coin is null."; 
            }                 
            break;
        case 'burn':
            if(AMOUNT){
                res.data = await bank.burn(AMOUNT);
            }else{
                res.result  = false;
                res.data    = "Coin is null."; 
            }                   
            break;
        case 'transaction':  
            if((KEY.length!=64)||(WALLET.length!=130)){
                res.result  = false;
                res.data    = "Wallet is wrong."; 
                break;
            }
            if(AMOUNT){
                res.data = await bank.remittance(TransactionDATA);
            }else{
                res.result  = false;
                res.data    = "Something is null."; 
            }                         
            break;
        case 'newWallet':            
            const newWallet = new wallet();
            res.data        = await newWallet.makeWallet(); 
            break; 
        case 'wallet':             
            console.log();
            if(WALLET){
                res.data    = await bank.Balance(WALLET);
            }else{
                res.result  = false;
                res.data    = "Wallet is wrong."; 
            }
            break;
        case 'myWallet':            
            if(KEY.length  == 64){
                res.data = await bank.getPublicKey(KEY); 
            }else{
                res.result  = false;
                res.data    = "Key is wrong."; 
            }
            break;
        case 'airDrop':
            const walletMake    = new wallet()
            if(WALLET.length != 130){
                res.result  = false;
                res.data    = "Wallet is wrong."; 
                break;
            }
            if(KEY == walletMake.getPrivate()){
                if(AMOUNT){
                    res.data    = await bank.airDrop(WALLET,AMOUNT);
                }else{
                    res.result  = false;
                    res.data    = "Coin is null."; 
                }                   
            }else{
                res.result  = false;
                res.data    = "MasterKey is wrong."; 
            }
            break;
        case 'createNewBlock':            
            res.result  = await bank.newBlock(); 
            break;        
        default:
            res.result  = false;
            break;
    }
    response.writeHead(201);
    response.write(JSON.stringify(res));
    response.end();
}
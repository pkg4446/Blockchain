const   Blockchain  = require('./blockchain');
const   Transaction = require('./transaction');
const   Encryption  = require('./encryption');

const   Coin        = new Blockchain();
const   transaction = new Transaction();

const   decimalPoint= 100000000;
const   feeRatio    = 10000;
////테스트 코드
//console.log(wallet);
module.exports = {
    decimalPoint: async function(){    
        return decimalPoint;
    },

    minting:    async function(coin){    
        const cost  = Number(coin);    
        if(cost>0) {
            const responce = await transaction.issuance(cost);
            return responce;
        }
    },
    burn:       async function(coin){
        const cost  = Number(coin);
        if(cost>0){        
            const balance   = await BalanceCheck(transaction.bank());
            console.log("Bank","in:",balance.InWait,balance.In,"out:",balance.Out,balance.OutWait,"total:",balance.Balance,balance.WaitBalance);
            if(balance.Balance>=cost && (balance.Balance+balance.WaitBalance)>=cost){
                transaction.retirement(cost);
                return cost + " coin has burned.";
            }else{
                return transaction.bank() + " has not enough the coin.";
            }
        }
    },
    airDrop:    async function(wallet,coin){
        const cost      = Number(coin);
        const balance   = await BalanceCheck(transaction.bank());
        console.log("Bank","in:",balance.InWait,balance.In,"out:",balance.Out,balance.OutWait,"total:",balance.Balance,balance.WaitBalance);
        if(balance.Balance>=cost && (balance.Balance+balance.WaitBalance)>=cost){
            const data = {
                publicKey:  wallet,
                amount:     cost
            }
            transaction.distribution(data);
            return wallet+` get ${cost} coin.`
        }else{
            return transaction.bank()+" has not enough the coin.";
        }
    },
    Balance:    async function(publicKey){
        const balance   = await BalanceCheck(publicKey);
        return balance;
    },
    remittance: async function(wallet){
        //새로운 트랜잭션 생성
        const balance   = await BalanceCheck(Encryption.getPublic(wallet.privateKey));
        const totalCoin = wallet.amount + (wallet.amount/feeRatio);
        if(balance.Balance>=totalCoin && (balance.Balance+balance.WaitBalance)>=totalCoin){
            const TransactionDATA = {
                addressOut: wallet.privateKey,
                addressIn:  wallet.publicKey,
                amount:     wallet.amount,
            }
            transaction.txInOut(TransactionDATA);
            const TransactionFee = {
                addressOut: wallet.privateKey,
                addressIn:  transaction.bank(),
                amount:     wallet.amount/feeRatio,
            }
            transaction.txInOut(TransactionFee);
            return Encryption.getPublic(wallet.privateKey) +` send ${await decimalPointRound(totalCoin)} coin.`
        }else{
            return Encryption.getPublic(wallet.privateKey) + "has not enough the coin.";
        }
    },
    newBlock:   async function(){        
        if(transaction.HISTORY.length){  
            Coin.createNewTransaction(transaction.HISTORY);
            transaction.HISTORY = [];
            Coin.createNewBlock();
            return true;
        }
        else{
            return false;
        }
    }, 
    getPublicKey:   async function(privateKey){
        return Encryption.getPublic(privateKey);
    }, 
}

async function  BalanceCheck(publicKey){
    const   fs  = require('fs');
    const   blockLocation = 'data/block/';
    const   dir = fs.readdirSync(blockLocation);
    let     walletIn    = 0;
    let     walletOut   = 0;    
    let     waitIn      = 0;
    let     waitOut     = 0;   
    const   history     = {
                            IN:[],
                            OUT:[],
                        }
    const   wait        = {
                            IN:[],
                            OUT:[],
                        }    
    for(file of dir){
        const buffer = fs.readFileSync(blockLocation+file, 'utf8');
        const block = eval("["+ buffer.toString()+"]");
        for(let chain of block) {
            if(chain){                
                const   temporaryIn     = chain.transactions.filter((TRANSACT) => TRANSACT.addressIn  === publicKey);
                const   temporaryOut    = chain.transactions.filter((TRANSACT) => TRANSACT.addressOut === publicKey);                
                walletIn    +=  temporaryIn.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                walletOut   +=  temporaryOut.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

                const   temporary       = history;
                history.IN  =   temporary.IN.concat(temporaryIn);
                history.OUT =   temporary.OUT.concat(temporaryOut);
            }
        }
    }    

    const   temporaryIn     = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressIn  === publicKey);
    const   temporaryOut    = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressOut === publicKey);
    waitIn  = temporaryIn.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    waitOut = temporaryOut.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

    const   temporary       = wait;
    wait.IN     =   temporary.IN.concat(temporaryIn);
    wait.OUT    =   temporary.OUT.concat(temporaryOut);

    responce    = {
                    In:             await decimalPointRound(walletIn),        
                    InWait:         await decimalPointRound(waitIn),
                    Out:            await decimalPointRound(walletOut),  
                    OutWait:        await decimalPointRound(waitOut),
                    Balance:        await decimalPointRound(walletIn - walletOut),
                    WaitBalance:    await decimalPointRound(waitIn - waitOut),
                    History:        history,
                    Wait:           wait
                }
    return responce;
}

async function  decimalPointRound(num){
    return Math.round(num * decimalPoint) / decimalPoint;;
}
//지갑 조회

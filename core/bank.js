const   Blockchain  = require('./blockchain');
const   Transaction = require('./transaction');
const   Encryption  = require('./encryption');

const   Coin        = new Blockchain();
const   transaction = new Transaction();

////테스트 코드
//console.log(wallet);
module.exports = {
    minting:    async function(coin){    
        const cost      = Number(coin);    
        if(cost) {
            const responce = await transaction.issuance(cost);
            return responce;
        }
    },
    burn:       async function(coin){
        const cost      = Number(coin);
        if(cost){        
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
        const balance = await BalanceCheck(publicKey);
        return balance;
    },
    remittance: async function(wallet){
        const TransactionDATA = {
            addressOut: wallet.privateKey,
            addressIn:  wallet.publicKey,
            amount:     wallet.amount,
        }
        //새로운 트랜잭션 생성
         //새로운 트랜잭션 생성
        const balance = BalanceCheck(Encryption.getPublic(wallet.privateKey));
        if(balance.Balance>=wallet.amount && balance.WaitBalance>=wallet.amount){
            transaction.txInOut(TransactionDATA);
            return Encryption.getPublic(wallet.privateKey) +` send ${wallet.amount} coin.`
        }else{
            return Encryption.getPublic(wallet.privateKey) + "has not enough the coin.";
        }
    },
    newBlock:   async function(){        
        if(transaction.HISTORY.length){  
            const newBlock = {}; 
            Coin.createNewTransaction(transaction.HISTORY);
            transaction.HISTORY = [];
            newBlock.index          = Coin.getLastBlock().index;
            newBlock.timestamp      = Coin.getLastBlock().timestamp;
            newBlock.transactions   = Coin.pendingTransaction;
            newBlock.hash           = Coin.getLastBlock().hash;
            //pow 작업
            newBlock.nonce          = Coin.proofOfWork(newBlock);
            newBlock.hash           = Coin.hashBlock(newBlock);
            newBlock.previousHash   = Coin.getLastBlock().hash;
            Coin.createNewBlock(newBlock);
            return true;
        }
        else{
            return false;
        }
    }, 
    getPublicKey:   async function(privateKey){
        console.log(Encryption.getPublic(privateKey));
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
    const   history = {
        IN:[],
        OUT:[],
    }
    const   wait = {
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
                walletIn    +=  temporaryIn.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);
                walletOut   +=  temporaryOut.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);

                const   temporary       = history;
                history.IN  =   temporary.IN.concat(temporaryIn);
                history.OUT =   temporary.OUT.concat(temporaryOut);
            }
        }
    }    

    const   temporaryIn     = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressIn  === publicKey);
    const   temporaryOut    = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressOut === publicKey);
    waitIn  = temporaryIn.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);
    waitOut = temporaryOut.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const   temporary       = wait;
    wait.IN  =   temporary.IN.concat(temporaryIn);
    wait.OUT =   temporary.OUT.concat(temporaryOut);

    responce = {
        In:             walletIn,        
        InWait:         waitIn,
        Out:            walletOut,  
        OutWait:        waitOut,
        Balance:        walletIn - walletOut,
        WaitBalance:    waitIn - waitOut,
        History:        history,
        Wait:           wait
    }
    return responce;
}
//지갑 조회

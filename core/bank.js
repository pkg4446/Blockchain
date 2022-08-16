const   Blockchain  = require('./blockchain');
const   Transaction = require('./transaction');
const   Encryption  = require('./encryption');

const   Coin        = new Blockchain();
const   transaction = new Transaction();

////테스트 코드
//console.log(wallet);
module.exports = {
    minting:    function(cost){if(cost)transaction.issuance(cost);},
    burn:       function(cost){
        if(cost){        
            const balance = BalanceCheck(transaction.bank(),true);
            console.log("Bank","in:",balance.In,"out:",balance.OUT,"total:",balance.Balance);
            if(balance.Balance>=cost){
                transaction.retirement(cost);
            }else{
                console.log(transaction.bank(),"has not enough coin.");
            }
            
        }
    },
    airDrop:    async function(wallet,coin){                
        const balance = await BalanceCheck(transaction.bank(),true);
        console.log("Bank","in:",balance.In,"out:",balance.Out,"total:",balance.Balance);
        if(balance.Balance>=coin){
            const data = {
                publicKey:  wallet,
                amount:     coin
            }
            transaction.distribution(data);
            return wallet+` get ${coin} coin.`
        }else{
            return transaction.bank()+" has not enough coin.";
        }
    },
    Balance:    async function(publicKey){
        const balance = await BalanceCheck(publicKey,false);
        return balance;
    },
    remittance: function(wallet){
        const TransactionDATA = {
            addressOut: wallet.privateKey,
            addressIn:  wallet.publicKey,
            amount:     wallet.amount,
        }
        //새로운 트랜잭션 생성
         //새로운 트랜잭션 생성
        const balance = BalanceCheck(Encryption.getPublic(wallet.privateKey),true);
        if(balance>=wallet.amount){
            transaction.txInOut(TransactionDATA);
        }else{
            console.log(Encryption.getPublic(wallet.privateKey),"has not enough coin.");
        }
    },
    newBlock:   function(){
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
    }, 
}

async function  BalanceCheck(publicKey,confirm){
    const   fs  = require('fs');
    const   blockLocation = 'data/block/';
    const   dir = fs.readdirSync(blockLocation);
    let     walletIn    = 0;
    let     walletOut   = 0;    
    const   history = {
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
                history.OUT =   temporary.OUT.concat(temporaryIn);
            }
        }
    }    
    if(confirm){
        const   temporaryIn     = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressIn  === publicKey);
        const   temporaryOut    = transaction.HISTORY.filter((TRANSACT) => TRANSACT.addressOut === publicKey);
        walletIn   += temporaryIn.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);
        walletOut  += temporaryOut.map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);

        const   temporary       = history;
        history.IN  =   temporary.IN.concat(temporaryIn);
        history.OUT =   temporary.OUT.concat(temporaryIn);
    }
    responce = {
        In:         walletIn,
        Out:        walletOut,
        Balance:    walletIn - walletOut,
        History:    history
    }
    return responce;
}
//지갑 조회

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
            const balance = BalanceCheck(transaction.bank());
            if(balance>=cost){
                transaction.retirement(cost);
            }else{
                console.log(transaction.bank(),"has not enough coin.");
            }
            
        }
    },
    airDrop:    async function(wallet){                
        const balance = await BalanceCheck(transaction.bank());
        if(balance>=wallet.amount){
            transaction.distribution(wallet);
            return wallet.publicKey+` get ${wallet.amount} coin.`
        }else{
            return transaction.bank()+" has not enough coin.";
        }
    },
    Balance:    async function(publicKey){await BalanceCheck(publicKey);},
    remittance: function(wallet){
        const TransactionDATA = {
            addressOut: wallet.privateKey,
            addressIn:  wallet.publicKey,
            amount:     wallet.amount,
        }
        //새로운 트랜잭션 생성
         //새로운 트랜잭션 생성
        const balance = BalanceCheck(Encryption.getPublic(wallet.privateKey));
        if(balance>=wallet.amount){
            transaction.txInOut(TransactionDATA);
        }else{
            console.log(Encryption.getPublic(wallet.privateKey),"has not enough coin.");
        }
    },
    newBlock:   function(){
        const newBlock = {};
        Coin.createNewTransaction(transaction.HISTORY);
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

async function  BalanceCheck(publicKey){
    const   fs  = require('fs');
    const   blockLocation = 'data/block/';
    const   dir = fs.readdirSync(blockLocation);
    let AllTransactions = [];
    for(file of dir){
        const buffer = fs.readFileSync(blockLocation+file, 'utf8');
        const block = eval("["+ buffer.toString()+"]");
        for(let chain of block) {
            if(chain){
                for(let tx of chain.transactions) {
                    AllTransactions.push(tx);
                }
            }
        }
    }    
    console.log('pendingTransaction',Coin.pendingTransaction)

    const walletIn  = AllTransactions.filter((TRANSACT) => TRANSACT.addressIn  === publicKey).map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const walletOut = AllTransactions.filter((TRANSACT) => TRANSACT.addressOut === publicKey).map((TRANSACT) => TRANSACT.amount).reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log("Balance","in:",walletIn,"out:",walletOut,"total:",walletIn - walletOut);
    return walletIn - walletOut;
}

//지갑 조회

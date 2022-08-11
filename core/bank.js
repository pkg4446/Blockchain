const   Blockchain  = require('./blockchain');
const   Transaction = require('./transaction');
const   Encryption  = require('./encryption');

const   Coin        = new Blockchain();
const   transaction = new Transaction();

console.log("Blockchain work on");

////테스트 코드
//console.log(wallet);
module.exports = {
    minting:    function(cost){if(cost)transaction.issuance(cost);},
    burn:       function(cost){if(cost)transaction.retirement(cost);},
    Balance:    function(publicKey){BalanceCheck(publicKey);},
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
            console.log(Encryption.getPublic(wallet.privateKey),"has not enough coins");
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

function BalanceCheck(publicKey){
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
    const walletIn  = AllTransactions.filter((TRANSACT) => TRANSACT.addressIn  === publicKey).map((TRANSACT) => TRANSACT.amount).reduce((a, b) => a + b, 0);
    const walletOut = AllTransactions.filter((TRANSACT) => TRANSACT.addressOut === publicKey).map((TRANSACT) => TRANSACT.amount).reduce((a, b) => a + b, 0);
    console.log("Balance",walletIn,walletOut,walletIn - walletOut);
    return walletIn - walletOut;
}

//지갑 조회

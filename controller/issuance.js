const modules = require('../core');

//제네시스 블럭
const Coin        = new modules.Blockchain;
const transaction = new modules.transaction;

console.log("제네시스 블럭1");
console.log("제네시스 블럭2");
console.log("제네시스 블럭3");
console.log("제네시스 블럭4");
console.log("제네시스 블럭5");
//코인 기록 읽어오기 추가
//DB가 없으면 제네시스 블럭 생성
if(!Coin.getLastBlock()){ 
    Coin.createGenesisBlock();
}
//마지막 블럭 가져오기
const blockData = Coin.getLastBlock()

////테스트 코드
const TransactionDATA = {
    addressIn:  "In주소",
    addressOut: "Out주소",
    amount:     1,
    outID:      "recipient",
}
transaction.InOut(TransactionDATA);
transaction.InOut(TransactionDATA);
console.log(transaction.confirm());


////테스트 코드
const Transaction = {
    amount:     100,
    sender:     "sender",
    recipient:  "recipient",
}
//새로은 트랜잭션 생성1 - (총금액, 보내는이, 받는이)
Coin.createNewTransaction(Transaction);
//새로은 트랜잭션 생성2 - (총금액, 보내는이, 받는이)
Coin.createNewTransaction(Transaction);
//새로은 트랜잭션 생성3 - (총금액, 보내는이, 받는이)
Coin.createNewTransaction(Transaction);
//새로은 트랜잭션 생성4. - (총금액, 보내는이, 받는이)
Coin.createNewTransaction(Transaction);

//새로운 블럭 만들기
for(let count = 0; count <= 2; count++){
    blockData.index             = Coin.getLastBlock().index;
    blockData.timestamp         = Coin.getLastBlock().timestamp;
    blockData.transactions      = Coin.pendingTransaction;

    //pow 작업
    blockData.nonce = Coin.proofOfWork(blockData);

    //console.log("inspection_hash",blockData);

    blockData.hash  = Coin.hashBlock(blockData);    
    blockData.previousHash      = Coin.getLastBlock().hash;

    Coin.createNewBlock(blockData);
    console.log(Coin.isValidNewBlock());

}
//모든 코인 보기
console.log("view");
console.log("view");
console.log("view");
console.log("view");
//for(let chain of Coin.block) {console.log("Block",chain);}









const   sha256 = require('sha256');

//블록체인 데이터 구조.
function Blockchain(){
    this.block              = [];
    this.pendingTransaction = [];    
}

//제네시스 블럭
Blockchain.prototype.createGenesisBlock = function(){
    const genesisBlock = {
        index:              0,
        timestamp:          Date.now(),        
        nonce:              0,
        previousHash:       "SmartHive",
        hash:               "SmartHive",
        transactions:       []
    };
    const hash = this.hashBlock(genesisBlock);
    const block = {
        nonce:          100,
        previousHash:   genesisBlock.hash,
        hash:           genesisBlock.hash
    }
    this.createNewBlock(block);
}

//블록체인 프로토 타입 함수 정의
Blockchain.prototype.createNewBlock = function(DATA){
    //새 블록 객체
    const newBlock = {
        index:              this.block.length + 1,
        timestamp:          Date.now(),        
        nonce:              DATA.nonce,
        previousHash:       DATA.previousHash,
        hash:               DATA.hash,
        transactions:       this.pendingTransaction
    };

    //다음 거래를 위한 거래내역 배열 비워주고 새로운 블록을 block 배열에 추가 
    this.pendingTransaction = [];
    this.block.push(newBlock);

    return newBlock;
}

//마지막 블록 얻기
Blockchain.prototype.getLastBlock = function(){
    return this.block[this.block.length - 1];   
}

//새로운 트랜젝션(거래)가 발생했을 때 작동되는 함수
//인자값으로, 총액수, 보내는사람, 받는사람이 들어간다.
Blockchain.prototype.createNewTransaction = function(DATA){
    const newTransaction = {
        amount:     DATA.amount,
        sender:     DATA.sender,
        recipient:  DATA.recipient,
        time:       new Date()
    }

    //맨위 트랜잭션 배열에 값을 넣어준다.
    this.pendingTransaction.push(newTransaction);

    //마지막 블록의 index 에서 + 1
    return this.getLastBlock()['index'] + 1
}

//해쉬 값 리턴 함수
Blockchain.prototype.hashBlock = function(DATA){
    return sha256(JSON.stringify(DATA));
}

const  Generation = {
    adjustmentBlock:    10,
    interval:           100,
    level:              3
}
//pow 작업 함수 - 이전블록의 해쉬, 현재 블록 데이터와 nonce 값을 사용한다.
Blockchain.prototype.proofOfWork = function(DATA){
    DATA.nonce   = 0;
    let hash    = this.hashBlock(DATA);
    let check   = "";
    Generation.level = 3; //그냥 발행 할 경우 난이도 level = 1
    
    for(let strCheck = 0; strCheck < Generation.level; strCheck++){check += "0"}
    while(hash.substring(0,Generation.level) != check){
        DATA.nonce++;
        hash = this.hashBlock(DATA)
    } 
        
    difficult(this)
    return DATA.nonce;
}
function difficult(block){   
    if(block.getLastBlock().index % Generation.adjustmentBlock == 0){           
        const blockInterver =   block.getLastBlock().timestamp - 
                                block.block[block.getLastBlock().index-Generation.adjustmentBlock].timestamp;
        if(blockInterver/Generation.adjustmentBlock < Generation.interval/2){
            Generation.level++;
        }else if(blockInterver/Generation.adjustmentBlock > Generation.interval*2){
            if(Generation.level > 1){  Generation.level--;    }
        }

        console.log("level", Generation.level)
        console.log("interval1", blockInterver/Generation.adjustmentBlock)
        console.log("interval2", blockInterver)
    }
}

//무결성 검증
Blockchain.prototype.isValidNewBlock = function(){
    const newBlock      = this.block[this.getLastBlock()['index']-1];
    const previousBlock = this.block[this.getLastBlock()['index']-2];
    const inspection    = {
        index:          previousBlock.index,
        timestamp:      previousBlock.timestamp,
        nonce:          newBlock.nonce,
        previousHash:   previousBlock.previousHash,
        hash:           newBlock.previousHash,
        transactions:   newBlock.transactions
      }    
      
   //console.log("inspection",inspection);

    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index', previousBlock.index, newBlock.index);
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash', previousBlock.hash, newBlock.previousHash);
        return false;
    } else if (this.hashBlock(inspection) !== newBlock.hash && inspection.index !== 1 ) {
        console.log('invalid previoushash', this.hashBlock(inspection), newBlock.hash);
        return false;
    }
    return true;
};

Blockchain.prototype.isValidChain = function() {
    const isValidGenesis = function(block){
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

//Blockchain 모듈화
module.exports = Blockchain;
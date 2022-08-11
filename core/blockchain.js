const   record      = require('./record');
const   Encryption  = require('./encryption');

//블록체인 데이터 구조.
function Blockchain(){
    this.block              = [];
    this.pendingTransaction = [];    
    this.block              = eval("["+record.getBlock()+"]");
    this.createGenesisBlock();
}

//제네시스 블럭
Blockchain.prototype.createGenesisBlock = function(){
    if(!this.getLastBlock()){ 
        const genesisBlock = {
            index:              0,
            timestamp:          Date.now(),        
            nonce:              100,
            previousHash:       "SmartHive",
            hash:               "SmartHive",
            transactions:       []
        };        
        genesisBlock.hash = this.hashBlock(genesisBlock);
        record.addBlock(genesisBlock);
        genesisBlock.index++;        
        genesisBlock.previousHash = genesisBlock.hash;
        genesisBlock.hash = this.hashBlock(genesisBlock);
        this.block.push(genesisBlock);
        record.addBlock(genesisBlock);
    }
}

//블록체인 프로토 타입 함수 정의
Blockchain.prototype.createNewBlock = function(DATA){
    //새 블록 객체
    console.log();
    const newBlock = {
        index:              this.block[this.block.length-1].index+1,
        timestamp:          Date.now(),        
        nonce:              DATA.nonce,
        previousHash:       DATA.previousHash,
        hash:               DATA.hash,
        transactions:       this.pendingTransaction
    };
    //다음 거래를 위한 거래내역 배열 비워주고 새로운 블록을 block 배열에 추가 
    this.pendingTransaction = [];
    if(this.isValidNewBlock()){
        this.block.push(newBlock);
        if(this.block.length>5){
            this.block = record.newFile(newBlock);
            this.block.length=1;
        }else{
            record.addBlock(newBlock);
        }        
        return newBlock;
    }
}

//마지막 블록 얻기
Blockchain.prototype.getLastBlock = function(){
    const lastBlock = this.block[this.block.length - 1];   
    return lastBlock;
}

//새로운 트랜젝션(거래)가 발생했을 때 작동되는 함수
//인자값으로, 총액수, 보내는사람, 받는사람이 들어간다.
Blockchain.prototype.createNewTransaction = function(DATA){
    //맨위 트랜잭션 배열에 값을 넣어준다.
    this.pendingTransaction = DATA;
    //마지막 블록의 index 에서 + 1
    return this.pendingTransaction;
}

//해쉬 값 리턴 함수
Blockchain.prototype.hashBlock = function(DATA){
    return Encryption.hashBlock(DATA);
}

//난이도 조절용 객체, 난이도 조절에 사용할 블럭 갯수 단위, 평균 블럭 생성 속도, 블럭생성 난이도
const  Generation = {
    adjustmentBlock:    10,
    interval:           100,
    level:              1
}
//pow 작업 함수 - 이전블록의 해쉬, 현재 블록 데이터와 nonce 값을 사용한다.
Blockchain.prototype.proofOfWork = function(DATA){
    DATA.nonce   = 0;
    let hash    = this.hashBlock(DATA);
    let check   = "";

    //그냥 발행 할 경우 난이도 level = 1
    Generation.level = 1; 
    
    for(let strCheck = 0; strCheck < Generation.level; strCheck++){check += "0"}
    while(hash.substring(0,Generation.level) != check){
        DATA.nonce++;
        hash = this.hashBlock(DATA)
    } 
    console.log("Generation.level",Generation.level);
    
    //난이도 조절 함수
    difficult(this);
    return DATA.nonce;
}

//난이도 조절 함수
function difficult(blockChain){       
    if(blockChain.getLastBlock().index % Generation.adjustmentBlock == 0 && blockChain.block.length > 1){           
        const blockInterver =   blockChain.getLastBlock().timestamp - 
                                blockChain.block[blockChain.getLastBlock().index-Generation.adjustmentBlock].timestamp;
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
    if(this.getLastBlock()>1){
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
    }
    return true;
};
//Blockchain 모듈화
module.exports = Blockchain;
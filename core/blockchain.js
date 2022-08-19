const   record      = require('./record');
const   Encryption  = require('./encryption');
const   bolckSave   = 101;

//블록체인 데이터 구조.
function Blockchain(){
    this.block              = [];
    this.pendingTransaction = [];    
    this.block              = eval("["+record.getBlock()+"]");
    this.createGenesisBlock();
}

//제네시스 블럭
Blockchain.prototype.createGenesisBlock = function(){
    if(!getLastBlock(this.block)){ 
        const genesisBlock  = {
                                index:          0,
                                timestamp:      Date.now(),        
                                nonce:          100,
                                previousHash:   0,
                                hash:           null,
                                transactions:   []
                            };        
        genesisBlock.hash   = Encryption.hashBlock(genesisBlock);
        this.block.push(genesisBlock);
        record.addBlock(genesisBlock);
        const firstBlock    = getLastBlock(this.block);
        const secondBlock   = {
                                index:          firstBlock.index+1,
                                timestamp:      Date.now(),
                                nonce:          proofOfWork(firstBlock,this.block),
                                previousHash:   firstBlock.hash,
                                hash:           null,
                                transactions:   []
                            };       
        secondBlock.hash    = Encryption.hashBlock(secondBlock);
        this.block.push(secondBlock);
        record.addBlock(secondBlock);
    }
}

//블록체인 프로토 타입 함수 정의
Blockchain.prototype.createNewBlock = function(){
    //새 블록 객체
    const lastBlock = this.block[this.block.length-1];
    const newBlock  = {
                        index:              lastBlock.index+1,
                        timestamp:          Date.now(),        
                        nonce:              proofOfWork(lastBlock,this.block),
                        previousHash:       lastBlock.hash,
                        hash:               null,
                        transactions:       this.pendingTransaction
                    };

    //record.hashKey(newBlock); //raw 데이터 검증 테스트

    newBlock.hash   = Encryption.hashBlock(newBlock);
    //다음 거래를 위한 거래내역 배열 비워주고 새로운 블록을 block 배열에 추가 
    this.pendingTransaction = [];
    if(isValidNewBlock(this.block,newBlock)){
        this.block.push(newBlock);
        if(this.block.length>bolckSave){
            this.block          = record.newFile(this.block[bolckSave-1],newBlock);
            this.block.length   = 2;
        }else{
            record.addBlock(newBlock);
        }        
        return newBlock;
    }
}

//마지막 블록 얻기
getLastBlock = function(block){
    const blockNumber   = block.length;
    const lastBlock     = block[blockNumber - 1];
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

//난이도 조절용 객체, 난이도 조절에 사용할 블럭 갯수 단위, 평균 블럭 생성 속도, 블럭생성 난이도
const  Generation = {
    adjustmentBlock:    10,
    interval:           100,
    level:              1
}
//pow 작업 함수 - 이전블록의 해쉬, 현재 블록 데이터와 nonce 값을 사용한다.
function proofOfWork (DATA,block){
    DATA.nonce  = 0;
    let hash    = Encryption.hashBlock(DATA);
    let check   = "";

    //그냥 발행 할 경우 난이도 level = 1
    Generation.level = 1; 
    
    for(let strCheck = 0; strCheck < Generation.level; strCheck++){check += "0"}
    while(hash.substring(0,Generation.level) != check){
        DATA.nonce++;
        hash = Encryption.hashBlock(DATA)
    } 
    //난이도 조절 함수
    difficult(block);
    return DATA.nonce;
}

//난이도 조절 함수
function difficult(block){       
    const lastBlock = getLastBlock(block);
    if(lastBlock.index % Generation.adjustmentBlock == 0 && block.length > Generation.adjustmentBlock + 1){           
        const blockInterver =   lastBlock.timestamp - block[lastBlock.index-Generation.adjustmentBlock].timestamp;
        if(blockInterver/Generation.adjustmentBlock < Generation.interval/2){
            Generation.level++;
        }else if(blockInterver/Generation.adjustmentBlock > Generation.interval*2){
            if(Generation.level > 1){  Generation.level--;  }
        }
    }
}

//무결성 검증
function isValidNewBlock(block,newBlock){
    const lastBlock = getLastBlock(block);
    if(lastBlock.index>1){
        const previousBlock = block[block.length-1];
        const inspection    = {
                                index:          block[block.length-1].index,
                                timestamp:      block[block.length-1].timestamp,
                                nonce:          block[block.length-2].nonce,
                                previousHash:   block[block.length-1].previousHash,
                                hash:           null,
                                transactions:   block[block.length-1].transactions
                            }    
        const preInspection = {
                                index:          block[block.length-2].index,
                                timestamp:      block[block.length-2].timestamp,
                                nonce:          block[block.length-2].nonce,
                                previousHash:   block[block.length-2].previousHash,
                                hash:           null,
                                transactions:   block[block.length-2].transactions
                            }          

        console.log("-----------------Inspection------------------------------------------------------");  
        console.log("preInspection  :",Encryption.hashBlock(preInspection), preInspection.index);     
        console.log("Block      PH  :",block[block.length-1].previousHash,  block[block.length-1].index);
        console.log("---------------------------------------------------------------------------------");       
        console.log("inspection     :",Encryption.hashBlock(inspection),    inspection.index);     
        console.log("Block      H   :",block[block.length-1].hash,          block[block.length-1].index);
        console.log("newBlock   PH  :",newBlock.previousHash,               newBlock.index);       
        console.log("---------------------------------------------------------------------------------");        
        
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index', previousBlock.index, newBlock.index);
            return false;
        }
        if (previousBlock.hash !== newBlock.previousHash) {
            console.log('invalid previoushash', previousBlock.hash, newBlock.previousHash);
            return false;
        }
        if (Encryption.hashBlock(preInspection) !== previousBlock.previousHash && Encryption.hashBlock(inspection) !== newBlock.previousHash) {
            console.log('invalid previoushash', Encryption.hashBlock(inspection), previousBlock.hash);
            return false;
        }
        
    }
    return true;
};
//Blockchain 모듈화
module.exports = Blockchain;
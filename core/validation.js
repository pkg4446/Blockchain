const   fs          = require('fs');
const   Encryption  = require('./encryption');

const   errorLocationr= 'data/error/';
const   blockLocation = 'data/block/';

module.exports = {
    getBlock:   function(){
        try {
            const buffer = fs.readdirSync(errorLocationr, 'utf8');
        } catch (error) {   
            console.error(`${errorLocationr} 폴더가 없어 ${errorLocationr} 폴더를 생성합니다.`);
            fs.mkdirSync(errorLocationr);
        }
        try {
            const dir   = fs.readdirSync(blockLocation);
            console.log(dir);
            let   preBlock = 0;
            for(let fileNumber=0; fileNumber<dir.length ;fileNumber++){
                const buffer = eval("["+fs.readFileSync(blockLocation+`blockchain_${fileNumber}.dat`, 'utf8').toString()+"]")
                for(block of buffer){
                    const inspection = {
                        index:          block.index,
                        timestamp:      block.timestamp,
                        nonce:          block.nonce,
                        previousHash:   block.previousHash,
                        hash:           block.hash,    
                        transactions:   block.transactions             
                    }
                    if(preBlock == 0){
                        preBlock = inspection;
                    }else{
                        const blockHash = Encryption.hashBlock(preBlock);   
/*
                        console.log("blockNumber    :",inspection.index);
                        console.log("blockHash      :",blockHash);
                        console.log("--------------------------------");                                                
                        console.log("preBlock.hash          :",preBlock.hash);           
                        console.log("preBlock.previousHash  :",preBlock.previousHash);
                        console.log("inspection.hash        :",inspection.previousHash);
                        console.log("inspection.previousHash:",inspection.hash,"\n\n");
*/
                        preBlock = inspection;
                    }                    
                }
            }                        
        } catch (error) {   
            console.log("File name is wrong.");
        }    
    },
}

function validate(data){    
    if(data.block){

    }
}
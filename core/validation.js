const   fs          = require('fs');
const   Encryption  = require('./encryption');

const   errorLocationr= 'data/error/';
const   blockLocation = 'data/block/';

exports.getBlock = function(){
    let     responce = true;
    try {
        const buffer = fs.readdirSync(errorLocationr, 'utf8');
    } catch (error) {   
        console.error(`${errorLocationr} 폴더가 없어 ${errorLocationr} 폴더를 생성합니다.`);
        fs.mkdirSync(errorLocationr);
    }
    try {
        const dir           = fs.readdirSync(blockLocation);
        let   preBlock      = 0;
        for(let fileNumber  = 0; fileNumber<dir.length ;fileNumber++){
            const buffer    = eval("["+fs.readFileSync(blockLocation+`blockchain_${fileNumber}.dat`, 'utf8').toString()+"]")
            for(block of buffer){
                if(responce){
                    const inspection    = {
                                            index:          block.index,
                                            timestamp:      block.timestamp,
                                            nonce:          block.nonce,
                                            previousHash:   block.previousHash,
                                            hash:           null,    
                                            transactions:   block.transactions             
                                        }
                    
                    if(preBlock == 0){
                        preBlock = inspection;
                    }else{                        
                        const blockHash = Encryption.hashBlock(preBlock);   
                        preBlock        = inspection;
                        responce        = validate(inspection.index-1,blockHash,inspection.previousHash);
                    }
                }
            }
        }
    } catch (error) {
        console.log("File name is wrong.");
    }
    return responce;
};

function validate(index,comparison,Reference){
    const   fileName = "isValiDate.dat";
    let     responce = true;
    if(comparison  !== Reference){
        if (fs.existsSync(errorLocationr+fileName)) {
            const temporary = fs.readFileSync(errorLocationr+fileName, 'utf8');
            const tempDate  = eval("["+temporary+"]");
            let   saveFlage = true;
            for(let preSave of tempDate){
                if(preSave.invalidBlocknumer == index)
                saveFlage   = false;
            }
            if(saveFlage)   fs.appendFileSync(errorLocationr+fileName, '{"invalidBlocknumer":' + index + "},\n");         
        }else{
            fs.writeFileSync(errorLocationr+fileName,  '{"invalidBlocknumer":' + index + "},\n"); 
        }
        console.log('inValiDate saved!');
        responce = false;
    }
    return responce;
}
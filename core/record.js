const   fs      = require('fs');

const blockLocation = 'core/data/';
const blockFile     = 'blockchain.dat';

function record(){
    this.block  =   [];
}

record.prototype.getBlock = function(){

    try {
        const buffer = fs.readdirSync(blockLocation, 'utf8');
    } catch (error) {   
        console.error(`${blockLocation} 폴더가 없어 ${blockLocation} 폴더를 생성합니다.`);
        fs.mkdirSync(blockLocation);
    }
    try {
        const buffer = fs.readFileSync(blockLocation+blockFile, 'utf8');
        return buffer.toString();
    } catch (error) {   
        console.error(`${blockFile} 파일이 없어 ${blockFile} 파일을 생성합니다.`);
        this.initBlockChain();
    }    
}

record.prototype.addBlock = function(DATA){    
    if (fs.existsSync(blockLocation+blockFile)) {
        fs.appendFileSync(blockLocation+blockFile, "\n" + JSON.stringify(DATA) + ",");        
        console.log('Blockchain saved!');
        return;
    }else{
        console.log('There is no savefile.');
    }
    
}


/*
fs.readFile('./record/block','utf8',(err, data) => {
    if(err) throw err;
    const object = eval(data);
    console.log(object);
});
*/

record.prototype.initBlockChain = function(){    
    if (fs.existsSync(blockLocation+blockFile)) {
        return;
    }
    const genesis = "";
    fs.writeFileSync(blockLocation+blockFile, genesis);
    console.log('new record created');
}

module.exports = record;
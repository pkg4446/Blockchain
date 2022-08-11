const   fs      = require('fs');

const   blockForder   = 'data/';
const   blockLocation = 'data/block/';
const   blockBackUp   = 'data/Backup/';
const   blockFile     = `blockchain_0.dat`;

module.exports = {
    getBlock:   function(){
        try {
            const buffer = fs.readdirSync(blockForder, 'utf8');
        } catch (error) {   
            console.error(`${blockForder} 폴더가 없어 ${blockForder} 폴더를 생성합니다.`);
            fs.mkdirSync(blockForder);
        }
        try {
            const buffer = fs.readdirSync(blockLocation, 'utf8');
        } catch (error) {   
            console.error(`${blockLocation} 폴더가 없어 ${blockLocation} 폴더를 생성합니다.`);
            fs.mkdirSync(blockLocation);
        }
        try {
            const buffer = fs.readdirSync(blockBackUp, 'utf8');
        } catch (error) {   
            console.error(`${blockBackUp} 폴더가 없어 ${blockBackUp} 폴더를 생성합니다.`);
            fs.mkdirSync(blockBackUp);
        }
        try {
            const dir = fs.readdirSync(blockLocation);
            const buffer = fs.readFileSync(blockLocation+`blockchain_${dir.length-1}.dat`, 'utf8');
            return buffer.toString();
        } catch (error) {   
            const dir = fs.readdirSync(blockLocation);
            for(file of dir){
                fs.copyFileSync(blockLocation+file,blockBackUp+file);
                fs.unlinkSync(blockLocation+file);
            }
            console.error(`${blockFile} 파일이 없어 ${blockFile} 파일을 생성합니다.`);
            this.initBlockChain();
        }    
    },
    addBlock:   function(DATA){
        const dir = fs.readdirSync(blockLocation);        
        if (fs.existsSync(blockLocation+`blockchain_${dir.length-1}.dat`)) {
            fs.appendFileSync(blockLocation+`blockchain_${dir.length-1}.dat`, JSON.stringify(DATA) + ",\n");        
            console.log('Blockchain saved!');
            return;
        }else{
            console.log('There is no savefile.');
        }
    },
    newFile:    function(DATA){
        const dir = fs.readdirSync(blockLocation);
        fs.writeFileSync(blockLocation+`blockchain_${dir.length}.dat`, JSON.stringify(DATA) + ",\n");
        return DATA;
    },
    initBlockChain: function(DATA){
        if (fs.existsSync(blockLocation+blockFile)) {
            return;
        }
        const genesis = "";
        fs.writeFileSync(blockLocation+blockFile, genesis);
        console.log('new record created');
    },
}
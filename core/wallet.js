const   fs          = require('fs');
const   encryption  = require('./encryption')

const privateKeyLocation    = 'data/wallet/';
const privateKeyFile        = 'privateKey';

function Wallet(){
    this.privateKey = this.getPrivate();
    this.publicKey  = encryption.getPublic(this.privateKey);
}

Wallet.prototype.getPrivate = function(){

    try {
        fs.readdirSync(privateKeyLocation, 'utf8');
    } catch (error) {   
        console.error(`${privateKeyLocation} 폴더가 없어 ${privateKeyLocation} 폴더를 생성합니다.`);
        fs.mkdirSync(privateKeyLocation);
    }
    try {
        const buffer = fs.readFileSync(privateKeyLocation+privateKeyFile, 'utf8');
        return buffer.toString();
    } catch (error) {   
        console.error(`${privateKeyFile} 파일이 없어 ${privateKeyFile} 파일을 생성합니다.`);
        this.initWallet();
        return this.getPrivate();
    }    
}

Wallet.prototype.initWallet = function(){    
    if (fs.existsSync(privateKeyLocation+privateKeyFile)) {
        return;
    }
    const newPrivateKey = encryption.generatePrivateKey();
    fs.writeFileSync(privateKeyLocation+privateKeyFile, newPrivateKey);
    this.privateKey = newPrivateKey;
    console.log('new wallet with private key created');
}

Wallet.prototype.makeWallet = async function(){    
    const newWallet = {
        PrivateKey: encryption.generatePrivateKey(),
        publicKey:  ''
    }
    newWallet.publicKey = encryption.getPublic(newWallet.PrivateKey);
    return newWallet;
}

module.exports = Wallet;
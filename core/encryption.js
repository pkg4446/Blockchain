const   ecdsa   = require('elliptic');
const   ec      = new ecdsa.ec('secp256k1');
const   sha256  = require('sha256');

//트랜젝션(거래) 함수
module.exports = {
    generatePrivateKey  : function(){
        const keyPair       = ec.genKeyPair();
        const privateKey    = sha256(keyPair.getPrivate().toString(16));
        return privateKey;
    },
    
    getPublic       : function(privateKey){
        const key = ec.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex');
    },

    signature       : function(Sign, privateKey){
        const key   = ec.keyFromPrivate(privateKey, 'hex');
        const sign  = toHexString(key.sign(Sign).toDER());
        return sign;
    },

    hashBlock       : function(DATA){
        return sha256(JSON.stringify(DATA));
    },

    transactionID   : function(TRANSACTION){
        let HISTORY     = []
        HISTORY.push(TRANSACTION);
        let txContent   = HISTORY.map(TXs => TXs.addressOut + TXs.addressIn + TXs.amount).reduce((a, b) => a + b, '');
        return sha256(txContent).toString();
    },
}

function toHexString(byteArray) {  
    return Array.from(byteArray, function(byte) {    
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);  
    }).join('')
} 
const   encryption  = require('./encryption');

//트랜젝션(거래) 함수
function Transaction(){
    this.HISTORY    = [];
}

Transaction.prototype.txInOut = function(DATA){
    const transaction = {        
        id:         "",
        time:       new Date().toString(),
        addressOut: encryption.getPublic(DATA.addressOut),
        addressIn:  DATA.addressIn,
        amount:     DATA.amount,        
        signature:  DATA.signature,
    }
    transaction.signature = this.signTransactionIn(DATA.addressOut);
    transaction.id = encryption.transactionID(this.HISTORY);
    console.log(transaction)
    this.HISTORY.push(transaction);
    return this.HISTORY;
}

Transaction.prototype.signTransactionIn = function(privateKey){
    const Sign      = encryption.transactionID(this.HISTORY);
    const signature = encryption.signature(Sign, privateKey);
    return signature;
}

module.exports = Transaction;
const   encryption  = require('./encryption');

const   mintCorp    = "mintCorp"
const   bank        = "SmarthiveMainBank"
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
        signature:  "",
    }
    transaction.signature = this.signTransactionIn(DATA.addressOut);
    transaction.id = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return this.HISTORY;
}

Transaction.prototype.issuance = function(cost){
    const transaction = {        
        id:         "",
        time:       new Date().toString(),
        addressOut: mintCorp,
        addressIn:  encryption.getPublic(bank),
        amount:     cost,        
        signature:  "",
    }
    transaction.signature = this.signTransactionIn(transaction.addressOut);
    transaction.id = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return this.HISTORY;
}

Transaction.prototype.retirement = function(cost){
    const transaction = {        
        id:         "",
        time:       new Date().toString(),
        addressOut: bank,
        addressIn:  mintCorp,
        amount:     cost,        
        signature:  "",
    }
    transaction.signature = this.signTransactionIn(transaction.addressOut);
    transaction.id = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return this.HISTORY;
} 

Transaction.prototype.signTransactionIn = function(privateKey){
    const Sign      = encryption.transactionID(this.HISTORY);
    const signature = encryption.signature(Sign, privateKey);
    return signature;
}

module.exports = Transaction;
const   encryption  = require('./encryption');

const   mintCorp    = "mintCorp"
const   bank        = "Bank"
//트랜젝션(거래) 함수
function Transaction(){
    this.HISTORY    = [];
}

Transaction.prototype.bank = function(){
    return bank;
}

Transaction.prototype.txInOut = async function(DATA){
    const transaction   = {        
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

Transaction.prototype.issuance = async function(cost){
    const transaction   = {        
                            id:         "",
                            time:       new Date().toString(),
                            addressOut: mintCorp,
                            addressIn:  bank,
                            amount:     cost,        
                            signature:  "",
                        }
    transaction.signature   = this.signTransactionIn(transaction.addressOut);
    transaction.id          = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return transaction;
}

Transaction.prototype.retirement = function(cost){
    const transaction   = {        
                            id:         "",
                            time:       new Date().toString(),
                            addressOut: bank,
                            addressIn:  mintCorp,
                            amount:     cost,        
                            signature:  "",
                        }
    transaction.signature   = this.signTransactionIn(transaction.addressOut);
    transaction.id          = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return this.HISTORY;
} 

Transaction.prototype.distribution = function(DATA){
    const transaction   = {        
                            id:         "",
                            time:       new Date().toString(),
                            addressOut: bank,
                            addressIn:  DATA.publicKey,
                            amount:     DATA.amount,       
                            signature:  "",
                        }
    transaction.signature   = this.signTransactionIn(transaction.addressOut);
    transaction.id          = encryption.transactionID(this.HISTORY);
    this.HISTORY.push(transaction);
    return this.HISTORY;
} 

Transaction.prototype.signTransactionIn = function(privateKey){
    const Sign      = encryption.transactionID(this.HISTORY);
    const signature = encryption.signature(Sign, privateKey);
    return signature;
}

module.exports = Transaction;
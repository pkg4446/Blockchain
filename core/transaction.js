const   sha256      = require('sha256');

//트랜젝션(거래) 함수
function Transaction(){
    this.ID      = "";
    this.history = [];
}

Transaction.prototype.InOut = function(DATA){
    const newTransaction = {
        time:       new Date(),
        addressIn:  DATA.addressIn,
        addressOut: DATA.addressOut,
        amount:     DATA.amount,
    }
    const wallet = {
        outID:  DATA.outID,
        nonce:  JSON.stringify(newTransaction)
    }
    newTransaction.signature = this.hashBlock(wallet)
    this.history.push(newTransaction);
}

Transaction.prototype.hashBlock = function(DATA){
    return sha256(JSON.stringify(DATA));
}

Transaction.prototype.confirm = function(){
    this.ID = this.hashBlock(this.history)
    return this;
}

module.exports = Transaction;
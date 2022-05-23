const   sha256      = require('sha256');

//트랜젝션(거래) 함수
function Transaction(){
    this.ID      = "";
    this.history = [];
}

Transaction.prototype.InOut = function(DATA){
    const newTransaction = {
        time:       new Date().toString(),
        addressIn:  DATA.addressIn,
        addressOut: DATA.addressOut,
        amount:     DATA.amount,
    }
    const wallet = {
        outID:  DATA.outID,
        nonce:  JSON.stringify(newTransaction)
    }
    newTransaction.signature = this.hashBlock(wallet)
    if(this.history[this.history.length-1]){
        if(this.history[this.history.length-1].signature !== newTransaction.signature){
            this.history.push(newTransaction);
        }else{
            //console.log("1초에 한번만 거래 가능");
        }
    }else{
        this.history.push(newTransaction);
    }
}

Transaction.prototype.hashBlock = function(DATA){
    return sha256(JSON.stringify(DATA));
}

Transaction.prototype.confirm = function(){
    this.ID = this.hashBlock(this.history)
    return this;
}

module.exports = Transaction;
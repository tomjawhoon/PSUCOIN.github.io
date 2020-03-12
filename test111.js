const Web3 = require('web3');
const ws = "wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261";
// wss://kovan.infura.io/ws/v3/37dd526435b74012b996e147cda1c261
const web3 = new Web3(ws);
web3.eth.subscribe("pendingTransactions", (error, result) => {
    if(!error) {
        var wallet = "0x4798578d82Cf35919c24BB6bf9392d1e48ca6d7C"
        // 0x483b84aeFabD6f19eba02F3fA078a9c2B489F1e2
        web3.eth.getTransaction(result)
            .then( (transaction)  =>{
               if(transaction !== null && transaction.to) {
                //console.log("transaction  ===>",transaction)
                console.log("transaction.to",transaction.to)
                //console.log("transaction.to  ===>",transaction.to.toLocaleLowerCase())
                   if((transaction.to).toLocaleLowerCase() === wallet) {
                
                   console.log(`
                     from: ${transaction.from}  
                     amount: ${web3.utils.fromWei(transaction.value, 'ether')}`)
                   }
               }
        });
    }
});
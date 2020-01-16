const Web3 = require('web3');
const ws = "wss://ropsten.infura.io/ws";
const web3 = new Web3(ws);
web3.eth.subscribe("newBlockHeaders", function(error, block) {
if(!error) {
  console.log(block);
 }
}
);
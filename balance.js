let Web3 = require('web3')
let url = 'https://kovan.infura.io/v3/4f5881a2f31a46a4bb75e8284c097cb4'
let web3 = new Web3(url)
let address = '0x6c25FE295Ecee6F0D8D34fC28dca2de68538fA4a'

var web3js;

function getERC20TokenBalance(tokenAddress, walletAddress, callback) {
  let minABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}
  ];
  let contract = new web3js.eth.Contract(minABI, tokenAddress);
    contract.methods.balanceOf(walletAddress).call((error, balance) => {
    contract.methods.decimals().call((error, decimals) => {
      console.log(balance);
      console.log(decimals);
      balance = balance / (10**decimals);
      callback(balance);
    });
  });
}

function onAddressChange(e) {
  let tokenAddress  = "0x0d01bc6041ac8f72e1e4b831714282f755012764";
  let walletAddress = "0x6c25FE295Ecee6F0D8D34fC28dca2de68538fA4a";
  if(tokenAddress != "" && walletAddress != "") {
    getERC20TokenBalance(tokenAddress, walletAddress, (balance) => {
      document.getElementById('result').innerText = balance.toString();
    });        
  }
}

window.onload = function() {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(web3.currentProvider);
  } else {
    web3js = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io"));
  }
}




// web3.eth.getBalance(address,(err, minABI) => {
//        console.log( minABI , ' wei')
//        console.log(web3.utils.fromWei(minABI, 'gwei'), ' gwei')
//        console.log(web3.utils.fromWei(minABI, 'Gwei'), ' GWei')
//        console.log(web3.utils.fromWei(minABI, 'ether'), ' ether')
//    })

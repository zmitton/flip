var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshGameData() {
  refreshBalance()
  refreshGameState()
  refreshBuyIn()
}

function refreshBalance() {
  web3.eth.getBalance(account, function(e, response){
    if(!e){
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = Math.round(response.valueOf()/1e15)/1000
    }else{
      setStatus("Error getting balance; see log.");
    }
  });
}

function refreshGameState() {
  var flipper = Flipper.deployed();
  var states = ["Open", "Offer Made", "Game On"];

  flipper.game.call().then(function(game) {
    var gameElement = document.getElementById("game");
    gameElement.innerHTML = states[game.valueOf()];
    // setWinChecker(game.valueOf() == 2)
    if(game.valueOf() == 2){ refreshWinnerStatus() }
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see logs");
  });
};

function refreshBuyIn() {
  var flipper = Flipper.deployed();

  flipper.buyIn.call().then(function(buyIn) {
    var buyInElement = document.getElementById("buyIn");
    buyInElement.innerHTML = Math.round(buyIn.valueOf()/1e15)/1000;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see logs");
  });
};


// function setWinChecker(polling){
//   if(polling){
//     window.winIntervalId = setInterval(refreshWinnerStatus, 5000)
//   }else if(window.winIntervalId){
//     clearInterval(window.winIntervalId)
//   }
// }

function refreshWinnerStatus(){
  web3.eth.getBlockNumber(function(e, response){
    if(!e){
      var currentBlockNumber = response.valueOf()
      var flipper = Flipper.deployed();

      flipper.seedBlock.call().then(function(seedBlockNumber) {

        var winnerElement = document.getElementById("winner");
        if(currentBlockNumber >= seedBlockNumber){
          winnerElement.innerHTML = "Winner has been drawn!";
          // setWinChecker(false)
        }else{
          winnerElement.innerHTML = "Waiting for winner";
        }
      }).catch(function(e) {
        console.log(e);
        setStatus("Error; see log.");
      });
    }else{
      setStatus("Error; see log.");
    }
  });
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }
    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
    accounts = accs;
    account = accounts[0];
    refreshGameData();
  });
}

function createGame() {
  var flipper = Flipper.deployed();

  var amount = parseInt(document.getElementById("amount").value * 1e18);

  setStatus("Initiating transaction... (please wait)");

  flipper.createGame({from: account, value: amount}).then(function() {
    setStatus("Transaction complete! Game has been Created");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};


function joinGame() {
  var flipper = Flipper.deployed();

  var amount = parseInt(document.getElementById("buyIn").innerHTML * 1e18);

  setStatus("Initiating transaction... (please wait)");

  flipper.joinGame({from: account, value: amount}).then(function() {
    setStatus("Transaction complete! Game has been Joined");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};

function settle() {
  var flipper = Flipper.deployed();

  setStatus("Initiating transaction... (please wait)");

  flipper.settle({from: account}).then(function() {
    setStatus("Transaction complete! Bet has been settled");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};


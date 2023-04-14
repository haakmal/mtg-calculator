function Calculate() {
  // Start with clean slate, remove message
  var msg1 = document.querySelector(".msg1")
  var msg2 = document.querySelector(".msg2")  
  msg1.classList.remove("lose", "win");
  msg2.classList.remove("lose", "win");
  
  // Attacker card values
  var attackArr = [
    Number(document.getElementById('p1-strength').value),
    Number(document.getElementById('p1-toughness').value),
    document.getElementById('p1-fstrike').checked,
    document.getElementById('p1-dstrike').checked]
  // Blocker card values
  var blockArr = [
    Number(document.getElementById('p2-strength').value),
    Number(document.getElementById('p2-toughness').value),
    document.getElementById('p2-fstrike').checked,
    document.getElementById('p2-dstrike').checked]    
  
  var attackRes1
  var blockRes1
  var attackRes2
  var blockRes2
  
  FirstStrike();
  Fight();
  Assign();
  Check();
  
  // Calculate First Strike
  function FirstStrike() {
    if (attackArr[2] === true) {
      blockArr[1] = blockArr[1] - attackArr[0]
    }
  }
  
  // Calculate Battle
  function Fight() {
    attackRes1 = attackArr[0] - blockArr[1]
    blockRes1 = attackArr[1] - blockArr[0]
    attackRes2 = blockArr[0] - attackArr[1]
    blockRes2 = blockArr[1] - attackArr[0]
  }
  
  // Calculate Double Strike
  function DoubleStrike() {
    if (attackArr[3] === true) {
      attackArr[0] == attackRes1
      attackRes1 = attackArr[0] - blockArr[1]
      blockRes1 = attackArr[1] - blockArr[0]
      attackRes2 = blockArr[0] - attackArr[1]
      blockRes2 = blockArr[1] - attackArr[0]
    }
  }
  
  // Assign attack and block to card
  function Assign() {
    document.getElementById("p1-result").innerHTML = attackRes1 + "/" + blockRes1;
    document.getElementById("p2-result").innerHTML = attackRes2 + "/" + blockRes2;
  }
  
  // Check result and update message
  function Check() {
    if (blockRes1 > 0) {
      msg1.classList.add("win");
    } else {msg1.classList.add("lose");};
    
    if (blockRes2 > 0) {
      msg2.classList.add("win");
    } else {msg2.classList.add("lose");};
  }
  
  }
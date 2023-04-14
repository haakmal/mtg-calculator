
function Calculate() {
  
  var msg1 = document.querySelector(".msg1")
  var msg2 = document.querySelector(".msg2")
    
  msg1.classList.remove("lose", "win");
  msg2.classList.remove("lose", "win");
  
  var attackArr = [
    Number(document.getElementById('p1-strength').value),
    Number(document.getElementById('p1-toughness').value),
    document.getElementById('p1-fstrike').checked,
    document.getElementById('p1-dstrike').checked]
  
  var blockArr = [
    Number(document.getElementById('p2-strength').value),
    Number(document.getElementById('p2-toughness').value),
    document.getElementById('p2-fstrike').checked,
    document.getElementById('p2-dstrike').checked]  
  
  var attackRes = attackArr[0] - blockArr[1]
  var blockRes = attackArr[1] - blockArr[0]
  

  document.getElementById("p1-result").innerHTML = 
      (attackArr[0] - blockArr[1]) +
      "/" +
      (attackArr[1] - blockArr[0]);
  
  
  document.getElementById("p2-result").innerHTML = 
      (blockArr[0] - attackArr[1]) +
      "/" +
      (blockArr[1] - attackArr[0]);
  
  
  
  function Check() {
    
    if (attackArr[1] <= 0) {
      msg1.classList.add("lose");
    }
    if (blockArr[1] <= 0) {
      msg2.classList.add("lose");
    }
    if (attackArr[1] > 0) {
      msg1.classList.add("win");
    }
    if (blockArr[1] > 0) {
      msg2.classList.add("win");
    }
  }
  
  Check();
  
  }
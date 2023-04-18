function Calculate() {
  // Start with clean slate, remove message
  var msg1 = document.querySelector(".msg1");
  var msg2 = document.querySelector(".msg2");
  msg1.classList.remove("lose", "win");
  msg2.classList.remove("lose", "win");

  /* Array map to pick values
  - 0 -> Strength
  - 1 -> Toughness
  - 2 -> First Strike
  - 3 -> Double Strike
  - 4 -> Deathtouch
  - 5 -> Lifelink
  - 6 -> Cannot Block
  - 7 -> Indestructible
  - 8 -> Win/Lose
  */
  // Attacker card values
  var attackArr = [
    Number(document.getElementById("p1-strength").value),
    Number(document.getElementById("p1-toughness").value),
    document.getElementById("p1-fstrike").checked,
    document.getElementById("p1-dstrike").checked,
    document.getElementById("p1-deathtouch").checked,
    document.getElementById("p1-lifelink").checked,
    document.getElementById("p1-noblock").checked,
    document.getElementById("p1-indestruct").checked,
    false
  ];
  // Blocker card values
  var blockArr = [
    Number(document.getElementById("p2-strength").value),
    Number(document.getElementById("p2-toughness").value),
    document.getElementById("p2-fstrike").checked,
    document.getElementById("p2-dstrike").checked,
    document.getElementById("p2-deathtouch").checked,
    document.getElementById("p2-lifelink").checked,
    document.getElementById("p2-noblock").checked,
    document.getElementById("p2-indestruct").checked,
    false
  ];

  // Current Stats
  var attackSTR = attackArr[0];
  var attackBLK = attackArr[1];
  var blockSTR = blockArr[0];
  var blockBLK = blockArr[1];
  var LifeLink;

  // Chain of actions
  Fight();
  Cleanup();
  Assign();
  Check(); // Update message
  Explain();

  // Update stats
  function Update() {}

  // Calculate First Strike
  // 1st striker deals damage, if it is not enough to kill then blocker deals damage in second step
  function FirstStrike() {
    if (attackArr[2] === true && blockArr[2] === true) {}
    else if (attackArr[2] === true) {
      blockBLK = blockArr[1] - attackArr[0];
      blockArr[1] = blockBLK;
    } else if (blockArr[2] === true) {
      attackBLK = attackArr[1] - blockArr[0];
      attackArr[1] = attackBLK;
    }
  }

  // Calculate Double Strike
  function DoubleStrike() {
    if (attackArr[3] === true) {
      blockBLK = blockArr[1] - attackArr[0];
      blockArr[1] = blockBLK;
    }
    if (blockArr[3] === true) {
      attackBLK = attackArr[1] - blockArr[0];
      attackArr[1] = attackBLK;
    }
  }

  // Calculate Battle
  function Fight() {
    // Check for Lifelink
    LifeLink();
    // Pre fight
    FirstStrike();
    DoubleStrike();

    // Check results of First Strike
   if (attackBLK < 1 || blockBLK < 1) {
      Check();
    }
    else {
      attackSTR = attackArr[0] - blockArr[1];
      blockSTR = blockArr[0] - attackArr[1];
      attackBLK = attackArr[1] - blockArr[0];
      blockBLK = blockArr[1] - attackArr[0];
    }
    
    // Check for Deathtouch
    Deathtouch();
    // Check for Indestructible
    Indestructible();
 
  }

  // Deathtouch  
  function Deathtouch() {
    if (blockArr[4] === true) {
      attackBLK = 0;
    }
    if (attackArr[4] === true) {
      blockBLK = 0;
    }
  }
  
  // Return Lifelink
  function LifeLink() {
    var damange
    if (attackArr[5] === true) {
      if (attackSTR > blockBLK) {
        damage = attackSTR - blockBLK
      } else {
        damage = attackSTR
      }
      document.getElementById("p1-lifelink-text").innerHTML = "+" + damage;
      document.querySelector(".lifelink1").classList.remove("hidden");
    }
    if (blockArr[5] === true) {
      if (blockSTR > attackBLK) {
        damage = blockSTR - attackBLK
      } else {
        damage = blockSTR
      }
      document.getElementById("p2-lifelink-text").innerHTML = "+" +
      document.querySelector(".lifelink2").classList.remove("hidden"); damage
    }
  }
  
  // Make Indestructible
  function Indestructible() {
    if (attackArr[7] === true) {
      attackBLK = attackArr[1];
    }
    if (blockArr[7] === true) {
      blockBLK = blockArr[1];
    }
  }

  // Assign attack and block to card
  function Assign() {
    document.getElementById("p1-result").innerHTML = attackSTR + "/" + attackBLK;
    document.getElementById("p2-result").innerHTML = blockSTR + "/" + blockBLK;
  }

  // Check result and update message
  function Check() {
    if (attackBLK > 0) {
      attackArr[8] == true;
      msg1.classList.add("win");
    } else {
      attackArr[8] == false;
      msg1.classList.add("lose");
    }

    if (blockBLK > 0) {
      blockArr[8] == true;
      msg2.classList.add("win");
    } else {
      blockArr[8] == false;
      msg2.classList.add("lose");
    }
  }

  function Cleanup() {
    // No negative strength
    if (attackBLK < 0) {
      attackBLK = 0;
    }
    if (blockBLK < 0) {
      blockBLK = 0;
    }
  }

  //----------- DETAILS PANE
  function Explain() {
    // Show box
    document.getElementById("explain-box").classList.remove("hidden");
    
    let attacker = "<code>Attacker</code>";
    let blocker = "<code>Blocker</code>";
    let fstrike = "<code>First Strike</code>";
    let dstrike = "<code>Double Strike</code>";
    let dtouch = "<code>Deathtouch</code>";
    let life = "<code>Lifelink</code>";
    let indest = "<code>Indestructible</code>";
    let ul = document.getElementById("explain");
    
    const text = [
      "<li>" + attacker + " hits " + attackArr[0] + "/" + attackArr[1] + "</li>",
      "<li>" + blocker + " has " + blockArr[0] + "/" + blockArr[1] + "</li>",
      
    ]
    
    ul.insertAdjacentHTML("beforeend", "<li>hello</li>");
  }
}

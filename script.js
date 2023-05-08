LISTEN();

function LISTEN() {
  // Listen for Cannot Block
  $("#p1-noblock").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-card").addClass("noblock");
    } else {
      $("#p1-card").removeClass("noblock");
    }
  });
  $("#p2-noblock").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-card").addClass("noblock");
    } else {
      $("#p2-card").removeClass("noblock");
    }
  });
  // Listen for Indestrictible
  $("#p1-indestruct").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-card").addClass("indestructible");
    } else {
      $("#p1-card").removeClass("indestructible");
    }
  });
  $("#p2-indestruct").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-card").addClass("indestructible");
    } else {
      $("#p2-card").removeClass("indestructible");
    }
  });
  // Listen for Flying
  $("#p1-flying").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-flying-text").addClass("flying-on");
    } else {
      $("#p1-flying-text").removeClass("flying-on");
    }
  });
  $("#p2-flying").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-flying-text").addClass("flying-on");
    } else {
      $("#p2-flying-text").removeClass("flying-on");
    }
  });
  // Listen for Reach
  $("#p1-reach").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-reach-text").addClass("reach-on");
    } else {
      $("#p1-reach-text").removeClass("reach-on");
    }
  });
  $("#p2-reach").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-reach-text").addClass("reach-on");
    } else {
      $("#p2-reach-text").removeClass("reach-on");
    }
  });
  // Listen for Planeswalker
  $("#p1-planeswalker").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-plane-text").addClass("planeswalker-on");
    } else {
      $("#p1-plane-text").removeClass("planeswalker-on");
    }
  });
  $("#p2-planeswalker").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-plane-text").addClass("planeswalker-on");
    } else {
      $("#p2-plane-text").removeClass("planeswalker-on");
    }
  });
  // Listen for Deathtouch
  $("#p1-deathtouch").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-death-text").addClass("deathtouch-on");
    } else {
      $("#p1-death-text").removeClass("deathtouch-on");
    }
  });
  $("#p2-deathtouch").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-death-text").addClass("deathtouch-on");
    } else {
      $("#p2-death-text").removeClass("deathtouch-on");
    }
  });
  // Listen for Lifelink
  $("#p1-lifelink").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-lifelink-text").addClass("lifelink-on");
    } else {
      $("#p1-lifelink-text").removeClass("lifelink-on");
    }
  });
  $("#p2-lifelink").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-lifelink-text").addClass("lifelink-on");
    } else {
      $("#p2-lifelink-text").removeClass("lifelink-on");
    }
  });
  // Listen for Trample
  $("#p1-trample").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-trample-text").addClass("trample-on");
    } else {
      $("#p1-trample-text").removeClass("trample-on");
    }
  });
  $("#p2-trample").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-trample-text").addClass("trample-on");
    } else {
      $("#p2-trample-text").removeClass("trample-on");
    }
  });
  // Listen for First Strike
  $("#p1-fstrike").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-fstrike-text").addClass("firststrike-on");
    } else {
      $("#p1-fstrike-text").removeClass("firststrike-on");
    }
  });
  $("#p2-fstrike").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-fstrike-text").addClass("firststrike-on");
    } else {
      $("#p2-fstrike-text").removeClass("firststrike-on");
    }
  });
  // Listen for Double Strike
  $("#p1-dstrike").change(function () {
    if ($(this).is(":checked")) {
      $("#p1-dstrike-text").addClass("doublestrike-on");
    } else {
      $("#p1-dstrike-text").removeClass("doublestrike-on");
    }
  });
  $("#p2-dstrike").change(function () {
    if ($(this).is(":checked")) {
      $("#p2-dstrike-text").addClass("doublestrike-on");
    } else {
      $("#p2-dstrike-text").removeClass("doublestrike-on");
    }
  });
}

// Calculate Basic Attack
function Attack() {
  // Attacker card values
  var ATTACK = {
    Power: Number(document.getElementById("p1-strength").value),
    Toughness: Number(document.getElementById("p1-toughness").value),
    FirstStrike: document.getElementById("p1-fstrike").checked,
    DoubleStrike: document.getElementById("p1-dstrike").checked,
    DeathTouch: document.getElementById("p1-deathtouch").checked,
    LifeLink: document.getElementById("p1-lifelink").checked,
    NoBlock: document.getElementById("p1-noblock").checked,
    Indestruct: document.getElementById("p1-indestruct").checked,
    Result: 0
  };
  // Blocker card values
  var BLOCK = {
    Power: Number(document.getElementById("p2-strength").value),
    Toughness: Number(document.getElementById("p2-toughness").value),
    FirstStrike: document.getElementById("p2-fstrike").checked,
    DoubleStrike: document.getElementById("p2-dstrike").checked,
    DeathTouch: document.getElementById("p2-deathtouch").checked,
    LifeLink: document.getElementById("p2-lifelink").checked,
    NoBlock: document.getElementById("p2-noblock").checked,
    Indestruct: document.getElementById("p2-indestruct").checked,
    Result: 0
  };

  //ol.innerHTML = "";
  // Reset message to default, this is to avoid repeat
  ResetMSG();
  // Check if card is indestructible
  Indestruct(ATTACK, BLOCK);
  // Check if card cannot block
  NoBlock(ATTACK, BLOCK);
  // Check if card has deadtouch
  DeathTouch(ATTACK, BLOCK);
  // Check if card has lifelink
  LifeLink(ATTACK, BLOCK);
  ATTACK.Result = ATTACK.Toughness - BLOCK.Power;
  BLOCK.Result = BLOCK.Toughness - ATTACK.Power;

  if (ATTACK.Result > 0) {
    document.getElementById("p1-msg").classList.add("win");
  } else {
    document.getElementById("p1-msg").classList.add("lose");
  }
  if (BLOCK.Result > 0) {
    document.getElementById("p2-msg").classList.add("win");
  } else {
    document.getElementById("p2-msg").classList.add("lose");
  }
}

//FirstStrike();
//DoubleStrike();
//LifeLink();

// Calculate DoubleStrike
function DoubleStrike() {
  var Player1 = document.getElementById("p1-dstrike-text");
  var Player2 = document.getElementById("p2-dstrike-text");
  // Reset values
  Player1.classList.remove("doublestrike-on");
  Player2.classList.remove("doublestrike-on");
  // Calculate deathtouch
  if (ATTACK.FirstStrike === true) {
    Player1.classList.add("doublestrike-on");
  }
  if (BLOCK.FirstStrike === true) {
    Player2.classList.add("doublestrike-on");
  }
}
// Apply Cannot Block
function NoBlock(ATTACK, BLOCK) {
  // Calculate Cannot Block
  if (ATTACK.NoBlock === true) {
    ATTACK.Toughness = 0;
  }
  if (BLOCK.NoBlock === true) {
    BLOCK.Toughness = 0;
  }
}
// Apply Indestructible
function Indestruct(ATTACK, BLOCK) {
  // Calculate Cannot Block
  if (ATTACK.Indestruct === true) {
    ATTACK.Toughness = 9999;
  }
  if (BLOCK.Indestruct === true) {
    BLOCK.Toughness = 9999;
  }
}

function ResetMSG() {
  document.getElementById("p1-msg").classList.remove("win");
  document.getElementById("p1-msg").classList.remove("lose");
  document.getElementById("p2-msg").classList.remove("win");
  document.getElementById("p2-msg").classList.remove("lose");
}

// Return Lifelink
function LifeLink(ATTACK, BLOCK) {
  var Player1 = document.getElementById("p1-lifelink-text");
  var Player2 = document.getElementById("p2-lifelink-text");

  // Reset values
  Player1.classList.remove("lifelink-on");
  Player1.innerHTML = "";
  Player2.classList.remove("lifelink-on");
  Player2.innerHTML = "";
  if (Player1.classList.contains("lifelink") === false) {
    Player1.classList.add("lifelink");
  }
  if (Player2.classList.contains("lifelink") === false) {
    Player2.classList.add("lifelink");
  }
  // Check for lifelink and calculate
  if (ATTACK.LifeLink === true) {
    Player1.classList.add("lifelink-on");
    Player1.classList.remove("lifelink");
    if (ATTACK.Power <= BLOCK.Toughness) {
      Player1.innerHTML = ATTACK.Power;
    } else {
      Player1.innerHTML = BLOCK.Toughness;
    }
  }
  if (BLOCK.LifeLink === true) {
    Player2.classList.add("lifelink-on");
    Player2.classList.remove("lifelink");
    if (BLOCK.Power <= ATTACK.Toughness) {
      Player2.innerHTML = BLOCK.Power;
    } else {
      Player2.innerHTML = ATTACK.Toughness;
    }
  }
}

// Apply Deathtouch
function DeathTouch(ATTACK, BLOCK) {
  var Player1 = document.getElementById("p1-death-text");
  var Player2 = document.getElementById("p2-death-text");
  // Reset values
  Player1.classList.remove("deathtouch-on");
  Player2.classList.remove("deathtouch-on");
  // Calculate deathtouch
  if (ATTACK.DeathTouch === true) {
    Player1.classList.add("deathtouch-on");
    BLOCK.Toughness = 0;
  }
  if (BLOCK.DeathTouch === true) {
    Player2.classList.add("deathtouch-on");
    ATTACK.Toughness = 0;
  }
}

// Apply Firststrike
function FirstStrike() {
  var Player1 = document.getElementById("p1-fstrike-text");
  var Player2 = document.getElementById("p2-fstrike-text");
  // Reset values
  Player1.classList.remove("firststrike-on");
  Player2.classList.remove("firststrike-on");
  // Calculate deathtouch
  if (ATTACK.FirstStrike === true) {
    Player1.classList.add("firststrike-on");
  }
  if (BLOCK.FirstStrike === true) {
    Player2.classList.add("firststrike-on");
  }
}
/*
  //----------- DETAILS PANE
  function Explain() {
    
    
    if (attackArr[2] === true) {
      
    }

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
    //NoBlock(); // Check for cannot block 
    LifeLink(); // Check for Lifelink
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

*/
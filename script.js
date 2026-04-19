let blockerCount = 1;

$(document).ready(function() {
    // Event delegation for checkboxes to toggle UI highlights dynamically for all current and future cards
    $(document).on('change', '.attr-cb', function() {
        const attr = $(this).data('attr');
        const card = $(this).closest('.card');
        const resSpan = card.find(`.res-${attr}`);
        
        if ($(this).is(':checked')) {
            resSpan.addClass('active-attr');
            if (attr === 'noblock') card.addClass('noblock');
            if (attr === 'indestructible') card.addClass('indestructible');
        } else {
            resSpan.removeClass('active-attr');
            if (attr === 'noblock') card.removeClass('noblock');
            if (attr === 'indestructible') card.removeClass('indestructible');
        }
    });
});

function AddBlocker() {
    blockerCount++;
    const id = `blocker-${blockerCount}`;
    const template = `
    <div class="card blocker-card" id="${id}" data-id="${id}">
      <span class="player">Blocker <button onclick="removeBlocker('${id}')" class="btn-remove">X</button></span><br>
      <div class="calc2">
        <div class="boxes">
          <input type="number" class="input stat-power" value="0">
          <label>/</label>
          <input type="number" class="input stat-toughness" value="0">
        </div>
        <div class="attributes">
          <span class="strike"><input class="check attr-cb" data-attr="firststrike" type="checkbox"><label>First Strike</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="doublestrike" type="checkbox"><label>Double Strike</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="deathtouch" type="checkbox"><label>Deathtouch</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="lifelink" type="checkbox"><label>Lifelink</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="noblock" type="checkbox"><label>Cannot Block</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="indestructible" type="checkbox"><label>Indestructible</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="flying" type="checkbox"><label>Flying</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="reach" type="checkbox"><label>Reach</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="trample" type="checkbox"><label>Trample</label></span>
          <span class="strike"><input class="check attr-cb" data-attr="planeswalker" type="checkbox"><label class="planeswalker">Planeswalker</label></span>
        </div>
      </div>
      <span class="player">Result</span>
      <div class="result">
        <span class="msg res-msg"></span>
        <span class="firststrike res-firststrike"></span>
        <span class="doublestrike res-doublestrike"></span>
        <span class="deathtouch res-deathtouch"></span>
        <span class="lifelink res-lifelink"></span>
        <span class="trample res-trample"></span>
        <span class="flying res-flying"></span>
        <span class="reach res-reach"></span>
        <span class="planeswalker res-planeswalker"></span>
      </div>
    </div>`;
    $('#blockers-container').append(template);
}

function removeBlocker(id) {
    $(`#${id}`).remove();
}

function getCreature(cardEl, index) {
    const el = $(cardEl);
    let readableId = 'Attacker';
    if (index !== undefined) {
        readableId = `Blocker ${index}`;
    }

    return {
        id: readableId,
        element: el,
        power: Number(el.find('.stat-power').val()) || 0,
        toughness: Number(el.find('.stat-toughness').val()) || 0,
        firstStrike: el.find('[data-attr="firststrike"]').is(':checked'),
        doubleStrike: el.find('[data-attr="doublestrike"]').is(':checked'),
        deathtouch: el.find('[data-attr="deathtouch"]').is(':checked'),
        lifelink: el.find('[data-attr="lifelink"]').is(':checked'),
        trample: el.find('[data-attr="trample"]').is(':checked'),
        flying: el.find('[data-attr="flying"]').is(':checked'),
        reach: el.find('[data-attr="reach"]').is(':checked'),
        cannotBlock: el.find('[data-attr="noblock"]').is(':checked'),
        indestructible: el.find('[data-attr="indestructible"]').is(':checked'),
        damageTaken: 0,
        deathtouchDamageTaken: false,
        dead: false,
        lifeGained: 0,
        damageToPlayer: 0
    };
}

function logExplanation(msg, type = "log-neutral") {
    const li = document.createElement("li");
    li.innerText = msg;
    li.className = `combat-event ${type}`;
    document.getElementById("explain").appendChild(li);
}

function resetCombatState() {
    $(".res-msg").removeClass("win lose").text("");
    $(".res-lifelink").text("");
    $(".res-trample").text("");
    $("#explain").empty();
}

function applyPlayerHealth(p1Delta, p2Delta) {
    if (p1Delta !== 0) {
        let p1h = Number($("#p1-health").val()) || 0;
        $("#p1-health").val(p1h + p1Delta);
        if (p1Delta > 0) logExplanation(`Attacker gains ${p1Delta} life.`, 'log-heal');
        if (p1Delta < 0) logExplanation(`Attacker loses ${-p1Delta} life.`, 'log-damage');
    }
    if (p2Delta !== 0) {
        let p2h = Number($("#p2-health").val()) || 0;
        $("#p2-health").val(p2h + p2Delta);
        if (p2Delta > 0) logExplanation(`Defender gains ${p2Delta} life.`, 'log-heal');
        if (p2Delta < 0) logExplanation(`Defender loses ${-p2Delta} life.`, 'log-damage');
    }
}

function Attack() {
    resetCombatState();
    
    let attacker = getCreature($('#attacker-card'));
    let blockers = [];
    $('.blocker-card').each(function(index) {
        blockers.push(getCreature(this, index + 1));
    });

    logExplanation("--- Declare Attackers & Blockers ---", "log-phase");
    
    // Check Evasion
    let validBlockers = [];
    for (let b of blockers) {
        if (b.cannotBlock) {
            logExplanation(`${b.id} cannot block. Removed from combat.`, "log-error");
            continue;
        }
        if (attacker.flying && !b.flying && !b.reach) {
            logExplanation(`${b.id} cannot block a flying attacker without flying or reach. Removed from combat.`, "log-error");
            continue;
        }
        validBlockers.push(b);
    }
    
    blockers = validBlockers;

    if (blockers.length === 0) {
        logExplanation("Attacker is unblocked.", "log-neutral");
        logExplanation("--- Combat Damage Step ---", "log-phase");
        
        let dmg = attacker.power;
        if (dmg > 0) {
            logExplanation(`Attacker deals ${dmg} damage to Defender.`, "log-damage");
            attacker.damageToPlayer += dmg;
            if (attacker.lifelink) attacker.lifeGained += dmg;
            applyPlayerHealth(attacker.lifeGained, -attacker.damageToPlayer);
        }
        resolveCombat(attacker, blockers, false);
        return;
    }

    logExplanation(`Attacker is blocked by ${blockers.length} creature(s). Order established sequentially.`, "log-neutral");

    let hasFirstStrikeStep = attacker.firstStrike || attacker.doubleStrike || blockers.some(b => b.firstStrike || b.doubleStrike);

    if (hasFirstStrikeStep) {
        logExplanation("--- First Strike Damage Step ---", "log-phase");
        dealDamagePhase(attacker, blockers, true);
        checkDeaths(attacker, blockers);
    }

    let needsNormalStep = (!attacker.dead && (!attacker.firstStrike || attacker.doubleStrike)) || 
                          blockers.some(b => !b.dead && (!b.firstStrike || b.doubleStrike));
                          
    if (needsNormalStep) {
        logExplanation("--- Normal Damage Step ---", "log-phase");
        dealDamagePhase(attacker, blockers, false);
        checkDeaths(attacker, blockers);
    }

    logExplanation("--- End of Combat ---", "log-phase");
    applyPlayerHealth(attacker.lifeGained, -attacker.damageToPlayer);
    
    // Also apply blocker lifelink (blocker healing goes to defender)
    let totalBlockerHealing = 0;
    for(let b of blockers) totalBlockerHealing += b.lifeGained;
    if (totalBlockerHealing > 0) applyPlayerHealth(0, totalBlockerHealing);

    resolveCombat(attacker, blockers, true);
}

function dealDamagePhase(attacker, blockers, isFirstStrikeStep) {
    let attackerStrikes = isFirstStrikeStep ? (attacker.firstStrike || attacker.doubleStrike) : (!attacker.firstStrike || attacker.doubleStrike);

    // Attacker deals damage
    if (attackerStrikes && !attacker.dead) {
        let remainingPower = attacker.power;
        if (remainingPower > 0) {
            for (let i = 0; i < blockers.length; i++) {
                let b = blockers[i];
                if (b.dead) continue;
                
                let lethal = b.toughness - b.damageTaken;
                if (attacker.deathtouch && lethal > 0) lethal = 1;
                
                // If it's the last blocker, assign all remaining damage to it
                // Unless Trample, then assign exactly lethal and trample the rest
                let dmgToAssign = 0;
                
                if (i === blockers.length - 1) {
                    if (attacker.trample) {
                        dmgToAssign = Math.min(remainingPower, Math.max(0, lethal));
                    } else {
                        dmgToAssign = remainingPower;
                    }
                } else {
                    dmgToAssign = Math.min(remainingPower, Math.max(0, lethal));
                }
                
                if (dmgToAssign > 0) {
                    b.damageTaken += dmgToAssign;
                    remainingPower -= dmgToAssign;
                    if (attacker.deathtouch) b.deathtouchDamageTaken = true;
                    logExplanation(`Attacker deals ${dmgToAssign} damage to ${b.id}.`, "log-damage");
                    if (attacker.lifelink) attacker.lifeGained += dmgToAssign;
                }
                
                if (remainingPower <= 0) break;
            }
            
            // If there is still remaining power and attacker has trample
            if (remainingPower > 0 && attacker.trample) {
                logExplanation(`Attacker tramples over for ${remainingPower} damage to Defender.`, "log-damage");
                attacker.damageToPlayer += remainingPower;
                if (attacker.lifelink) attacker.lifeGained += remainingPower;
            }
        }
    }

    // Blockers deal damage
    for (let b of blockers) {
        let bStrikes = isFirstStrikeStep ? (b.firstStrike || b.doubleStrike) : (!b.firstStrike || b.doubleStrike);
        if (bStrikes && !b.dead) {
            let dmg = b.power;
            if (dmg > 0) {
                attacker.damageTaken += dmg;
                if (b.deathtouch) attacker.deathtouchDamageTaken = true;
                logExplanation(`${b.id} deals ${dmg} damage to Attacker.`, "log-damage");
                if (b.lifelink) b.lifeGained += dmg;
            }
        }
    }
}

function checkDeaths(attacker, blockers) {
    let check = (c) => {
        if (!c.dead && c.damageTaken > 0) {
            if (c.damageTaken >= c.toughness || c.deathtouchDamageTaken) {
                if (c.indestructible) {
                    logExplanation(`${c.id} takes lethal damage but is indestructible.`, "log-neutral");
                } else {
                    c.dead = true;
                    logExplanation(`${c.id} is destroyed.`, "log-death");
                }
            }
        }
    };
    check(attacker);
    blockers.forEach(b => check(b));
}

function resolveCombat(attacker, blockers, wasBlocked) {
    let aMsg = attacker.element.find(".res-msg");

    if (wasBlocked) {
        if (attacker.dead) {
            aMsg.addClass("lose").text("Destroyed");
        } else {
            aMsg.addClass("win").text("Survives");
        }
        
        blockers.forEach(b => {
            let bMsg = b.element.find(".res-msg");
            if (b.dead) {
                bMsg.addClass("lose").text("Destroyed");
            } else {
                bMsg.addClass("win").text("Survives");
            }
            let bLl = b.element.find(".res-lifelink");
            if (b.lifeGained > 0) {
                bLl.text(`+${b.lifeGained}`).addClass("active-attr");
            }
        });
    } else {
        aMsg.addClass("win").text("Unblocked");
        $('.blocker-card').each(function() {
            $(this).find(".res-msg").text("Invalid");
        });
    }

    let aLl = attacker.element.find(".res-lifelink");
    if (attacker.lifeGained > 0) {
        aLl.text(`+${attacker.lifeGained}`).addClass("active-attr");
    }

    let aTr = attacker.element.find(".res-trample");
    if (attacker.damageToPlayer > 0) {
        aTr.text(`>${attacker.damageToPlayer}`).addClass("active-attr");
    }
}
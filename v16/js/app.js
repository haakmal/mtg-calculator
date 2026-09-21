import {state,KEYWORDS,createCreature,findCreature} from './state.js';
import {calculateCombat} from './engine.js';
import {renderResult} from './description.js';

const $=selector=>document.querySelector(selector);
const escapeHTML=value=>String(value).replace(/[&<>]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[character]));

function renderCard(creature){
  const selected=creature.abilities.map(ability=>`<button class="tag" data-ability="${ability}" data-id="${creature.id}">${ability}</button>`).join('');
  const available=KEYWORDS.filter(keyword=>!creature.abilities.includes(keyword)).map(keyword=>`<button class="keyword" data-ability="${keyword}" data-id="${creature.id}">${keyword}</button>`).join('');
  const assignment=creature.type==='blocker'?`<label class="assign">Block attacker<select data-blocker="${creature.id}"><option value="">Unassigned</option>${state.attackers.map(attacker=>`<option value="${attacker.id}" ${creature.blockedAttacker==attacker.id?'selected':''}>${escapeHTML(attacker.name)}</option>`).join('')}</select></label>`:'';
  return `<article class="creature"><button class="remove" data-remove="${creature.type}" data-id="${creature.id}">×</button><div class="card-top"><h3>${escapeHTML(creature.name)}</h3><div class="stats"><label><input type="number" min="0" data-stat="power" data-id="${creature.id}" value="${creature.power}"><span>POW</span></label>/<label><input type="number" min="1" data-stat="toughness" data-id="${creature.id}" value="${creature.toughness}"><span>TOU</span></label></div></div><div class="selected">${selected}</div><button class="drawer-toggle" data-drawer="${creature.id}">Edit keywords</button><div class="drawer" id="drawer-${creature.id}">${available}</div>${assignment}</article>`;
}

function renderCards(){
  $('#attackers').innerHTML=state.attackers.map(renderCard).join('')||'<p>No attackers.</p>';
  $('#blockers').innerHTML=state.blockers.map(renderCard).join('')||'<p>No blockers.</p>';
  $('#attackCount').textContent=state.attackers.length;
  $('#blockCount').textContent=state.blockers.length;
}

function showBuild(){
  state.phase='build';
  $('#heading').textContent='Build the combat.';
  $('#subheading').textContent='Add the attackers and blockers already declared in play.';
  $('#description').innerHTML='<p>Assign blockers, then select Attack to calculate the result.</p>';
  $('#attack').textContent='Attack';
}

function clearScenario(){
  state.nextId=1;
  state.attackers=[];
  state.blockers=[];
  showBuild();
  renderCards();
}

function returnToBuild(){
  showBuild();
  renderCards();
}

function performAttack(){
  if(!state.attackers.length){window.alert('Add at least one attacker first.');return;}
  const result=calculateCombat();
  $('#description').innerHTML=renderResult(result);
  if(!result.valid){
    showBuild();
    $('#description').innerHTML=renderResult(result);
    return;
  }
  state.phase='attack';
  $('#heading').textContent='Combat result.';
  $('#subheading').textContent='Resolved through the combat stages.';
  $('#attack').classList.add('active');
  $('#attack').textContent='Back to build';
}

function handleClick(event){
  const target=event.target;
  if(target.id==='addAttacker'){state.attackers.push(createCreature(`Attacker ${state.attackers.length+1}`,'attacker'));renderCards();return;}
  if(target.id==='addBlocker'){state.blockers.push(createCreature(`Blocker ${state.blockers.length+1}`,'blocker'));renderCards();return;}
  if(target.id==='reset'){clearScenario();return;}
  if(target.id==='build'){returnToBuild();return;}
  if(target.id==='attack'){state.phase==='attack'?returnToBuild():performAttack();return;}
  if(target.dataset.drawer){const drawer=$(`#drawer-${target.dataset.drawer}`);drawer.classList.toggle('open');target.textContent=drawer.classList.contains('open')?'Close keywords':'Edit keywords';return;}
  if(target.dataset.ability){const creature=findCreature(target.dataset.id);creature.abilities.includes(target.dataset.ability)?creature.abilities=creature.abilities.filter(ability=>ability!==target.dataset.ability):creature.abilities.push(target.dataset.ability);renderCards();return;}
  if(target.dataset.remove){const collection=target.dataset.remove==='attacker'?'attackers':'blockers';state[collection]=state[collection].filter(creature=>creature.id!=target.dataset.id);renderCards();return;}
  if(target.id==='help')$('#helpDialog').showModal();
  if(target.id==='close')$('#helpDialog').close();
}

document.addEventListener('click',handleClick);
document.addEventListener('input',event=>{if(event.target.dataset.stat)findCreature(event.target.dataset.id)[event.target.dataset.stat]=event.target.value;});
document.addEventListener('change',event=>{if(!event.target.dataset.blocker)return;const blocker=state.blockers.find(creature=>creature.id==event.target.dataset.blocker);blocker.blockedAttacker=event.target.value;});
clearScenario();

import {state,has} from './state.js';
import {validateCombat} from './legality.js';
import {getDamageSteps} from './steps.js';

export function calculateCombat(){
  const legality=validateCombat(state);
  if(!legality.valid)return{valid:false,legality:legality.errors,steps:[],final:[]};
  const marked=new Map(),destroyed=new Set(),steps=[];let playerDamage=0;
  const markedOn=creature=>marked.get(creature.id)||0;
  const mark=(creature,amount)=>marked.set(creature.id,markedOn(creature)+amount);
  const destroyAfterStep=[];
  const all=[...state.attackers,...state.blockers];
  const damageSteps=getDamageSteps(state.attackers,state.blockers);

  damageSteps.forEach(step=>{
    const events=[];const stateEvents=[];const damageEvents=[];
    state.attackers.forEach(attacker=>{
      if(destroyed.has(attacker.id))return;
      const blockers=state.blockers.filter(blocker=>blocker.blockedAttacker==attacker.id&&!destroyed.has(blocker.id));
      if(!blockers.length){
        if(step.participates(attacker)){damageEvents.push({source:attacker,target:null,amount:Number(attacker.power),toPlayer:true});}
        return;
      }
      if(step.participates(attacker)){
        const minimum=blockers.reduce((sum,blocker)=>sum+(has(attacker,'Deathtouch')?1:Number(blocker.toughness)),0);
        blockers.forEach(blocker=>events.push(`${attacker.name} must assign at least ${has(attacker,'Deathtouch')?1:blocker.toughness} damage to ${blocker.name}.`));
        if(blockers.length>1)events.push('The attacking player chooses how to divide damage among these blockers.');
        if(has(attacker,'Trample')){const excess=Math.max(0,Number(attacker.power)-minimum);if(excess){playerDamage+=excess;events.push(`${attacker.name} may assign up to ${excess} excess damage to the opposing player through trample.`);}}
        if(blockers.length===1) blockers.forEach(blocker=>damageEvents.push({source:attacker,target:blocker,amount:Number(attacker.power)}));
      }
      blockers.forEach(blocker=>{if(step.participates(blocker))damageEvents.push({source:blocker,target:attacker,amount:Number(blocker.power)});});
    });
    damageEvents.forEach(event=>{
      if(event.toPlayer){playerDamage+=event.amount;events.push(`${step.name}: ${event.source.name} deals ${event.amount} damage to the opposing player.`);if(has(event.source,'Lifelink'))events.push(`${event.source.name} has lifelink; its controller gains ${event.amount} life.`);return;}
      mark(event.target,event.amount);events.push(`${step.name}: ${event.source.name} deals ${event.amount} damage to ${event.target.name}.`);if(has(event.source,'Lifelink')&&event.amount)events.push(`${event.source.name} has lifelink; its controller gains ${event.amount} life.`);if(has(event.source,'Deathtouch'))events.push(`${event.target.name} has been dealt damage by a source with deathtouch.`);
    });
    all.forEach(creature=>{if(destroyed.has(creature.id)||has(creature,'Indestructible'))return;if(markedOn(creature)>=Number(creature.toughness)||[...damageEvents].some(event=>event.target?.id===creature.id&&has(event.source,'Deathtouch'))){destroyed.add(creature.id);stateEvents.push(`${creature.name} is destroyed after ${step.name.toLowerCase()}.`);}});
    steps.push({name:step.name,events,stateEvents});
  });
  const final=[];destroyed.forEach(id=>final.push(`${all.find(creature=>creature.id===id).name} is no longer in combat.`));
  return{valid:true,legality:[],steps,final,playerDamage};
}

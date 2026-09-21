export const KEYWORDS=['Flying','Reach','Menace','First strike','Double strike','Trample','Deathtouch','Lifelink','Vigilance','Indestructible'];
export const state={phase:'build',nextId:1,attackers:[],blockers:[]};
export function createCreature(name,type){return{id:state.nextId++,name,type,power:2,toughness:2,abilities:[],blockedAttacker:''}}
export function findCreature(id){return[...state.attackers,...state.blockers].find(c=>c.id==id)}
export const has=(creature,ability)=>creature.abilities.includes(ability);

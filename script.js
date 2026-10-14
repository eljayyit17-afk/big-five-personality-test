'use strict';
const traits = {
  O:{name:'Openness',description:'Curiosity, creativity, and interest in new ideas.'},
  C:{name:'Conscientiousness',description:'Organization, planning, and follow-through.'},
  E:{name:'Extraversion',description:'Energy from social interaction and expressiveness.'},
  A:{name:'Agreeableness',description:'Cooperation, empathy, and consideration for others.'},
  N:{name:'Neuroticism',description:'Sensitivity to worry, stress, and negative emotions.'}
};
// Original, illustrative items; reverse-coded items balance each trait.
const questions = [
  ['I enjoy exploring unfamiliar ideas.', 'O', false],
  ['I like meeting and talking with new people.', 'E', false],
  ['I usually finish tasks before deadlines.', 'C', false],
  ['I try to understand how other people feel.', 'A', false],
  ['I worry about things going wrong.', 'N', false],
  ['I prefer familiar routines over trying new experiences.', 'O', true],
  ['I feel drained by most social gatherings.', 'E', true],
  ['I often leave tasks unfinished.', 'C', true],
  ['I rarely consider other people’s points of view.', 'A', true],
  ['I stay calm under pressure.', 'N', true],
  ['I have an active imagination.', 'O', false],
  ['I feel comfortable speaking in groups.', 'E', false],
  ['I keep my belongings and work organized.', 'C', false],
  ['I am willing to help someone who needs support.', 'A', false],
  ['Small problems can upset me for a long time.', 'N', false],
  ['Artistic and creative activities rarely interest me.', 'O', true],
  ['I prefer to avoid being the center of attention.', 'E', true],
  ['I often act without planning ahead.', 'C', true],
  ['I find it difficult to cooperate with others.', 'A', true],
  ['I recover quickly after stressful situations.', 'N', true]
];
const labels=['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'];
const el=id=>document.getElementById(id);
let current=0, responses=Array(questions.length).fill(null);
function show(id){for(const section of ['welcome','quiz','results'])el(section).classList.toggle('hidden',section!==id)}
function renderQuestion(){
  el('counter').textContent=`Question ${current+1} of ${questions.length}`;
  el('progress').style.width=`${((current+1)/questions.length)*100}%`;
  el('question').textContent=questions[current][0];
  el('answers').replaceChildren();
  labels.forEach((label,i)=>{
    const wrapper=document.createElement('label');wrapper.className='answer';
    const radio=document.createElement('input');radio.type='radio';radio.name='rating';radio.value=String(i+1);radio.checked=responses[current]===i+1;
    radio.addEventListener('change',()=>{responses[current]=i+1;el('error').textContent=''});
    const span=document.createElement('span');span.textContent=`${i+1} — ${label}`;
    wrapper.append(radio,span);el('answers').append(wrapper);
  });
  el('previous').disabled=current===0;el('next').textContent=current===questions.length-1?'See Results →':'Next →';el('error').textContent='';
}
function showResults(){
  const totals=Object.fromEntries(Object.keys(traits).map(key=>[key,[]]));
  questions.forEach(([_,trait,reverse],index)=>totals[trait].push(reverse?6-responses[index]:responses[index]));
  const name=el('name').value.trim();el('result-title').textContent=name?`${name}'s Personality Results`:'Your Personality Results';
  el('scores').replaceChildren();
  for(const [key,trait] of Object.entries(traits)){
    const values=totals[key];const average=values.reduce((a,b)=>a+b,0)/values.length;
    const score=Math.round((average-1)*25);
    const block=document.createElement('div');block.className='result';
    const head=document.createElement('div');head.className='result-head';
    const label=document.createElement('span');label.textContent=trait.name;
    const value=document.createElement('span');value.textContent=`${score}/100`;head.append(label,value);
    const bar=document.createElement('div');bar.className='bar';
    const fill=document.createElement('div');fill.style.width=`${score}%`;bar.append(fill);
    const desc=document.createElement('p');desc.textContent=trait.description;
    block.append(head,bar,desc);el('scores').append(block);
  }
  show('results');window.scrollTo({top:0,behavior:'smooth'});
}
el('start').addEventListener('click',()=>{current=0;responses=Array(questions.length).fill(null);show('quiz');renderQuestion()});
el('previous').addEventListener('click',()=>{if(current>0){current--;renderQuestion()}});
el('next').addEventListener('click',()=>{
  if(responses[current]===null){el('error').textContent='Please choose an answer to continue.';return}
  if(current===questions.length-1){showResults();return}current++;renderQuestion();
});
el('restart').addEventListener('click',()=>{current=0;responses=Array(questions.length).fill(null);show('welcome')});
el('print').addEventListener('click',()=>window.print());

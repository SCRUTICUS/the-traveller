const story=document.querySelector('[data-expedition]');
const frame=story.querySelector('.cinema');
const opening=story.querySelector('.title-screen');
const notes=[...story.querySelectorAll('[data-feature]')];
const quiet=matchMedia('(prefers-reduced-motion: reduce), (max-height: 450px)');
const stops={destinations:.37,amazon:.37,sahara:.62,canyon:.90};
function ease(begin,end,progress){
  const t=Math.max(0,Math.min(1,(progress-begin)/(end-begin)));
  return t*t*(3-2*t);
}
let scheduled=0,active=-2;
function caption(index){
  if(active===index)return;
  active=index;notes.forEach((note,i)=>note.hidden=i!==index);
}
function render(){
  scheduled=0;
  if(quiet.matches){caption(0);opening.inert=false;return;}
  const p=Math.max(0,Math.min(1,-story.getBoundingClientRect().top/Math.max(1,story.offsetHeight-frame.offsetHeight)));
  const intro=1-ease(.015,.16,p),rise=ease(.21,.36,p);
  const sand=ease(.455,.57,p),canyon=ease(.735,.85,p);
  const turn=ease(.35,.62,p)+ease(.62,.90,p);
  const style=frame.style;
  style.setProperty('--intro',intro);
  style.setProperty('--shift',(-45*(1-intro))+'px');
  style.setProperty('--forest',.38+.62*ease(0,.19,p));
  style.setProperty('--forest-y',(50-4*ease(0,.22,p))+'%');
  style.setProperty('--sand',sand);style.setProperty('--canyon',canyon);
  style.setProperty('--lift',((1-rise)*110)+'vh');
  style.setProperty('--object',ease(.22,.29,p));
  style.setProperty('--yaw',(-13-120*turn)+'deg');
  style.setProperty('--exit',ease(.94,1,p));
  style.setProperty('--note',ease(.31,.37,p)*(1-Math.sin(Math.PI*sand))*(1-Math.sin(Math.PI*canyon)));
  caption(p<.31?-1:p<.5125?0:p<.7925?1:2);
  opening.inert=intro<.12;
}
function schedule(){if(!scheduled)scheduled=requestAnimationFrame(render);}
function jump(hash){
  const fraction=stops[hash.slice(1)];
  if(fraction===undefined||quiet.matches)return;
  const top=scrollY+story.getBoundingClientRect().top+(story.offsetHeight-frame.offsetHeight)*fraction;
  window.scrollTo({top,behavior:'instant'});render();
}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('hashchange',()=>jump(location.hash));
document.querySelectorAll('a[href]').forEach(link=>{
  const url=new URL(link.href);
  if(url.pathname===location.pathname && stops[url.hash.slice(1)]!==undefined){
    link.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||quiet.matches)return;
      event.preventDefault();history.pushState(null,'',url.hash);jump(url.hash);
    });
  }
});
quiet.addEventListener('change',render);
render();jump(location.hash);

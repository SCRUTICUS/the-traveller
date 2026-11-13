import { panels, projectPanel, chapterAngles } from './pavilion.js';

const journey=document.querySelector('[data-journey]');
const frame=journey.querySelector('.journey-frame');
const chapters=[...journey.querySelectorAll('[data-chapter]')];
const links=[...journey.querySelectorAll('[data-go]')];
const landscape=[...journey.querySelectorAll('.horizon img')];
const places=JSON.parse(document.querySelector('#plate-places').textContent);
const graphic=journey.querySelector('.pavilion');
const place=journey.querySelector('[data-place]');
const reduced=matchMedia('(prefers-reduced-motion: reduce), (max-height: 540px)');
const stops=[0,.32,.62,.92];
const hashes=['#main','#destinations','#amazon','#canyon'];
const nodes=[...graphic.querySelectorAll('[data-pane]')].map((group,i)=>({
  group, surface:group.querySelector('.surface'), lines:group.querySelectorAll('.reflection,.rim'),
  image:group.querySelector('image'), clip:graphic.querySelector('[data-clip="'+i+'"]'),
  internalEdge:graphic.querySelector('[data-inner-edge="'+i+'"]')
}));
let start=0, travel=0, frameRequest=0, active=-1, lastAngle=null;
const clamp=v=>Math.min(1,Math.max(0,v));
function paint(angle, reveal){
  if(lastAngle===angle) return;
  lastAngle=angle;
  panels.forEach((panel,i)=>{
    const view=projectPanel(panel,angle), node=nodes[i];
    node.group.setAttribute('visibility',view.visible?'visible':'hidden');
    node.internalEdge.setAttribute('visibility',view.visible?'hidden':'visible');
    if(!view.visible) {
      node.internalEdge.setAttribute('points',view.coords);
      return;
    }
    node.surface.setAttribute('points',view.coords);
    node.surface.setAttribute('fill',view.glass);
    node.lines.forEach(line=>line.setAttribute('points',view.coords));
    if(node.image){
      node.clip.setAttribute('points',view.coords);
      node.image.setAttribute('transform',view.transform);
      node.image.setAttribute('opacity',view.opacity*(.65+.35*reveal));
    }
  });
}
function activate(index){
  if(active===index) return;
  const previous=active;
  active=index;
  chapters.forEach((el,i)=>el.hidden=i!==index);
  links.filter(link=>link.closest('.route-index')).forEach(link=>{
    if(+link.dataset.go===index) link.setAttribute('aria-current','step');
    else link.removeAttribute('aria-current');
  });
  const world=Math.max(0,index-1);
  landscape.forEach((img,i)=>img.classList.toggle('selected',i===world));
  place.textContent=places[world];
  if(previous>=0 && !reduced.matches) chapters[index].animate(
    [{opacity:.25,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:160,easing:'ease-out'}
  );
}
function render(){
  frameRequest=0;
  if(reduced.matches){
    const index=Math.max(0,active);
    activate(index);paint(chapterAngles[index],index?1:0);
    graphic.style.removeProperty('transform');
    return;
  }
  const progress=clamp((scrollY-start)/Math.max(1,travel));
  let right=stops.findIndex(s=>s>progress);
  if(right<0) right=stops.length-1;
  const left=Math.max(0,right-1);
  const mix=clamp((progress-stops[left])/(stops[right]-stops[left]||1));
  const eased=mix*mix*(3-2*mix);
  const angle=chapterAngles[left]+(chapterAngles[right]-chapterAngles[left])*eased;
  activate(mix>=.5?right:left);
  paint(angle,clamp(progress/stops[1]));
  const enter=clamp(progress/stops[1]);
  graphic.style.transform='translateY('+(-enter*3)+'%) scale('+(1+enter*.07)+')';
}
function schedule(){
  if(!frameRequest) frameRequest=requestAnimationFrame(render);
}
function measure(){
  start=journey.getBoundingClientRect().top+scrollY;
  travel=journey.offsetHeight-frame.offsetHeight;
  lastAngle=null;
  render();
}
function go(index,behavior){
  if(reduced.matches){
    activate(index);lastAngle=null;render();
    window.scrollTo({top:index===0?0:start,behavior:'instant'});return;
  }
  window.scrollTo({top:index===0?0:start+travel*stops[index],behavior});
}
links.forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
  event.preventDefault();
  const index=Number(link.dataset.go);
  history.replaceState(null,'',location.pathname+location.search+hashes[index]);
  go(index,'instant');
}));
const fromHash=()=>{const i=hashes.indexOf(location.hash);if(i>=0) go(i,'instant');};
window.addEventListener('hashchange',fromHash);
window.addEventListener('scroll',schedule,{passive:true});
new ResizeObserver(measure).observe(frame);
reduced.addEventListener('change',measure);
measure();fromHash();

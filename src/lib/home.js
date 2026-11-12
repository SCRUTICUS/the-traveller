const config = JSON.parse(document.querySelector('#scene-config').textContent);
const scenes = [...document.querySelectorAll('.hero-view')];
let active = 0;
function changeScene(step) {
  active = (active + step + scenes.length) % scenes.length;
  scenes[active].style.backgroundImage = 'url("' + scenes[active].dataset.src + '")';
  scenes.forEach((view, index) => view.classList.toggle('active', index === active));
  document.querySelector('[data-name]').textContent = config.names[active];
  document.querySelector('[data-count]').textContent = '0' + (active + 1) + ' / 03';
}
document.querySelector('[data-prev]').addEventListener('click', () => changeScene(-1));
document.querySelector('[data-next]').addEventListener('click', () => changeScene(1));

// Project three hexagonal rings to make the sloped roof and six glass walls.
const model = document.querySelector('[data-model]');
const canvas = model.querySelector('canvas');
const ctx = canvas.getContext('2d');
const buttons = [...model.querySelectorAll('button')];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const step = Math.PI / 3;
let angle = 0, target = 0, spin = 0, drift = 0, frame = 0, width = 0, height = 0;
let isVisible = false, textures = [];
function point(index, radius, y) {
  const a = index * step - Math.PI / 6 + angle + drift;
  const x = Math.sin(a) * radius, z = Math.cos(a) * radius;
  return [width / 2 + x * spin, height * 0.55 + (y * 0.94 + z * 0.32) * spin, z];
}
function path(points) {
  ctx.beginPath();
  points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath();
}
function paint(points, fill, stroke) {
  path(points); ctx.fillStyle = fill; ctx.fill();
  if (stroke) {ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke();}
}
function draw() {
  frame = 0;
  if (!width || !ctx) return;
  angle += (target-angle)*(reduce.matches ? 1 : 0.115);
  if (Math.abs(angle-target)<0.001) angle=target;
  ctx.clearRect(0,0,width,height);
  const ground = ctx.createRadialGradient(width/2,height*.85,0,width/2,height*.85,width*.37);
  ground.addColorStop(0,'rgba(0,0,0,.7)');ground.addColorStop(1,'rgba(0,0,0,0)');
  ctx.save();ctx.translate(0,height*.85);ctx.scale(1,.16);ctx.translate(0,-height*.85);
  ctx.fillStyle=ground;ctx.fillRect(0,-height*3,width,height*8);ctx.restore();
  const faces = Array.from({length:6},(_,i)=>{
    const j=(i+1)%6, top=[point(i,.65,-.59),point(j,.65,-.59)], belt=[point(i,1,-.24),point(j,1,-.24)], bottom=[point(i,.93,.51),point(j,.93,.51)];
    return {i,z:(belt[0][2]+belt[1][2])/2,roof:[...top,belt[1],belt[0]],wall:[...belt,bottom[1],bottom[0]]};
  }).sort((a,b)=>a.z-b.z);
  for(const {i,z,wall,roof} of faces) {
    paint(wall,'#26312e','#566254');
    const img=textures[i%3];
    if(img?.complete && img.naturalWidth) {
      const [a,b,,d]=wall;
      // Map the photograph to a pane, clipping the lower bevel at its frame.
      ctx.save();path(wall);ctx.clip();
      ctx.transform(b[0]-a[0],b[1]-a[1],d[0]-a[0],d[1]-a[1],a[0],a[1]);
      const sw=Math.min(img.naturalWidth,img.naturalHeight*1.35), sh=img.naturalHeight;
      ctx.drawImage(img,(img.naturalWidth-sw)/2,0,sw,sh,-.12,0,1.24,1.04);ctx.restore();
    }
    const glass=ctx.createLinearGradient(wall[0][0],wall[0][1],wall[2][0]+1,wall[2][1]);
    glass.addColorStop(0,'rgba(180,207,186,.25)');glass.addColorStop(.35,'rgba(7,18,14,.20)');glass.addColorStop(1,'rgba(3,10,8,'+(z>.7?.32:.62)+')');
    paint(wall,glass,'#929a82');paint(roof,z>.6?'#39453e':'#28332e','#788174');
  }
  paint(Array.from({length:6},(_,i)=>point(i,.65,-.59)),'#414b44','#8a9384');
  if(angle!==target) schedule();
}
function schedule(){ if(!frame) frame=requestAnimationFrame(draw); }
function resize(){
  const box=canvas.getBoundingClientRect(); width=box.width; height=box.height;
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  spin=Math.min(width*.37,height*.63); schedule();
}
function selectFace(i){
  const nearest=Math.round(-angle/step);
  const delta=((i-nearest)%3+3)%3;
  target=-(nearest+(delta===2?-1:delta))*step;
  model.querySelector('[data-model-name]').textContent=config.names[i];
  model.querySelector('[data-model-feel]').textContent=config.senses[i];
  buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j))); schedule();
}
buttons.forEach((b,i)=>b.addEventListener('click',()=>selectFace(i)));
function onScroll() {
  if(!isVisible) return;
  const rect=model.getBoundingClientRect();
  drift=reduce.matches?0:Math.max(-.22,Math.min(.22,(innerHeight*.5-rect.top-rect.height*.5)/innerHeight*.45));schedule();
}
if(ctx){
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry])=>{
    isVisible=entry.isIntersecting;
    if(isVisible && !textures.length) textures=config.textures.map(src=>{const img=new Image();img.onload=schedule;img.src=src;return img;});
    onScroll();
  },{rootMargin:'150px'}).observe(model);
  window.addEventListener('scroll',onScroll,{passive:true});reduce.addEventListener('change',onScroll);
}

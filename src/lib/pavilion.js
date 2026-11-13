// A truncated octahedron has eight hexagonal windows joined by six square panes.
// Project its vertices along axes measured against the supplied oblique drawing.
const dot = (a,b) => a.reduce((sum,v,i) => sum + v*b[i], 0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const unit = a => a.map(n => n/Math.hypot(...a));
const horizontal = unit([52,74,-71]);
const toward = unit(cross([96,-69,1], horizontal));
const vertical = unit([96,-69,1]);
const vertices = [];
for (const x of [-2,-1,0,1,2])
  for (const y of [-2,-1,0,1,2])
    for (const z of [-2,-1,0,1,2])
      if (new Set([Math.abs(x),Math.abs(y),Math.abs(z)]).size === 3) vertices.push([x,y,z]);

const normals = [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]];
for (const x of [-1,1]) for (const y of [-1,1]) for (const z of [-1,1]) normals.push([x,y,z]);
const windows = ['1,1,1','1,1,-1','1,-1,-1'];
export const panels = normals.map(normal => {
  const hex = normal.every(n => n !== 0);
  const n = unit(normal);
  const points = vertices.filter(p => dot(normal,p) === (hex ? 3 : 4));
  const center = n.map((_,i) => points.reduce((sum,p) => sum+p[i],0)/points.length);
  const axis = Math.abs(dot(n,vertical)) > .98 ? horizontal : vertical;
  const side = unit(cross(n,axis));
  const down = cross(side,n);
  points.sort((a,b) => Math.atan2(dot(a,down),dot(a,side)) - Math.atan2(dot(b,down),dot(b,side)));
  return { points, center, side, down, normal:n, hex, window:windows.indexOf(normal.join(',')) };
});

const projectLocal = p => [dot(p,horizontal),dot(p,vertical),dot(p,toward)];
const stepAngles = windows.map(id=>{
  const p=projectLocal(id.split(',').map(Number));
  return Math.atan2(p[0],p[2]);
});
export const chapterAngles = [0,...stepAngles];

export function projectPanel(panel,angle) {
  const c=Math.cos(angle),s=Math.sin(angle);
  function project(p) {
    // The drawing's lower bevel is shallow; the solid ends at a level floor.
    const rim=[2,-p[2],-p[1]];
    const vertex=p[0]===2 && p[1]+p[2]<0 ? p.map((v,i)=>rim[i]+(v-rim[i])*.36) : p;
    const [x,y,z]=projectLocal(vertex);
    return [320+104*(c*x-s*z),278+105*y, s*x+c*z];
  }
  const points=panel.points.map(project);
  const coords=points.map(p=>p.slice(0,2).map(v=>v.toFixed(2)).join(',')).join(' ');
  const center=project(panel.center);
  const side=project(panel.center.map((v,i)=>v+panel.side[i]));
  const down=project(panel.center.map((v,i)=>v+panel.down[i]));
  const n=projectLocal(panel.normal);
  const depth=s*n[0]+c*n[2],sideLight=c*n[0]-s*n[2];
  const level=Math.max(0,Math.min(1,.37+.27*depth-.35*n[1]-.2*sideLight));
  const shade=(start,end)=>Math.round(start+(end-start)*level);
  const glass='rgb('+[shade(20,79),shade(32,99),shade(34,99)].join(',')+')';
  const transform='matrix('+[side[0]-center[0],side[1]-center[1],down[0]-center[0],down[1]-center[1],center[0],center[1]].map(v=>v.toFixed(3)).join(' ')+')';
  const area=points.reduce((sum,a,i)=>{
    const b=points[(i+1)%points.length];
    return sum+a[0]*b[1]-a[1]*b[0];
  },0);
  return {coords, visible:area>0, glass, transform, opacity:Math.max(.1,Math.min(.98,depth*1.16))};
}

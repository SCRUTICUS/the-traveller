// Shared vertices, traced in the 427 × 468 oblique view supplied by the designer.
// Depth is reconstructed from the incidence of the adjoining four- and six-sided panes.
// Vertices behind the front glass are shared with the same mesh when the shell turns.
const landmarks=[
  [-2,-1,0,65,122], [-2,0,-1,183,70], [-2,0,1,51,60], [-2,1,0,185,2],
  [-1,-2,0,51,254], [-1,0,-2,278,145], [-1,0,2,15,151], [-1,2,0,308,18],
  [0,-2,-1,150,322], [0,-2,1,22,351], [0,-1,-2,261,267], [0,-1,2,1,313],
  [0,1,-2,390,160], [0,1,2,143,185], [0,2,-1,418,113], [0,2,1,303,110],
  [1,-2,0,131,416], [1,0,-2,367,298], [1,0,2,120,359], [1,2,0,424,208],
  [2,-1,0,241,466], [2,0,-1,368,399], [2,0,1,253,445], [2,1,0,398,371],
];
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalize=v=>v.map(n=>n/Math.hypot(...v));
const right=normalize([52,74,-71]);
const up=normalize([-96,69,-1]);
const toward=normalize(cross(right,up));
const tilt=.22;
const vertices=landmarks.map(([x,y,z,px,py])=>{
  const screenY=py-233,depth=112*dot([x,y,z],toward);
  return {key:[x,y,z],x:px-213,y:screenY*Math.cos(tilt)-depth*Math.sin(tilt),z:depth*Math.cos(tilt)+screenY*Math.sin(tilt)};
});
const imageFaces={'1,1,1':'amazon','1,1,-1':'sahara','1,-1,-1':'canyon','-1,1,-1':'glacier','-1,-1,-1':'bamboo','-1,-1,1':'alps'};
const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])directions.push([x,y,z]);
export const panes=directions.map(normal=>{
  const hex=normal.every(Boolean);
  const members=vertices.filter(v=>dot(v.key,normal)===(hex?3:2));
  const axis=normalize(cross(normal,Math.abs(normal[1])===1&&!hex?[1,0,0]:[0,1,0]));
  const down=cross(axis,normalize(normal));
  members.sort((a,b)=>Math.atan2(dot(a.key,down),dot(a.key,axis))-Math.atan2(dot(b.key,down),dot(b.key,axis)));
  const label=normal.join(',');
  return {members,normal,world:imageFaces[label],tone:({'-1,1,1':'#155541','0,1,0':'#438b82','0,0,1':'#394b25','1,0,0':'#594331','1,-1,1':'#453e30','1,1,1':'#436731'})[label] || (hex?'#254d43':'#376260')};
});
export const chapterAngles=[0,...[[1,1,-1],[1,-1,-1]].map(n=>Math.atan2(dot(n,right),dot(n,toward)))];
export function project(pane,angle){
  const sin=Math.sin(angle),cos=Math.cos(angle);
  const points=pane.members.map(v=>{
    const z=v.x*sin+v.z*cos;
    return [213+v.x*cos-v.z*sin,233+v.y*Math.cos(tilt)+z*Math.sin(tilt),z];
  });
  const area=points.reduce((total,[x,y],i)=>{const b=points[(i+1)%points.length];return total+x*b[1]-y*b[0];},0);
  return {points:points.map(p=>p.slice(0,2).map(n=>n.toFixed(2)).join(',')).join(' '),front:area>0,depth:points.reduce((s,p)=>s+p[2],0)/points.length,area:Math.abs(area)};
}

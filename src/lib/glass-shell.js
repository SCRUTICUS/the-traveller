const TAU = 2 * Math.PI;
const step = TAU / 5;
const signs = [1, -1];
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const unit = v => v.map(x => x / Math.hypot(...v));
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

// The twelve face normals form an icosahedron. Each of its twenty triangles
// contributes one shared corner to the three pentagons meeting there.
const normals = [[0, 1, 0], [0, -1, 0]];
for (const sign of signs) {
  for (let i = 0; i < 5; i++) {
    const a = step * (i + (sign < 0 ? .5 : 0));
    normals.push([2*Math.sin(a)/Math.sqrt(5), sign/Math.sqrt(5), 2*Math.cos(a)/Math.sqrt(5)]);
  }
}
const members = normals.map(() => []);
function adjacent(a, b) {
  return Math.abs(dot(normals[a], normals[b]) - 1/Math.sqrt(5)) < 1e-8;
}
for (let i = 0; i < normals.length; i++) {
  for (let j = i+1; j < normals.length; j++) {
    if (!adjacent(i,j)) continue;
    for (let k = j+1; k < normals.length; k++) {
      if (!adjacent(i,k) || !adjacent(j,k)) continue;
      const vertex = unit(normals[i].map((x,n) => x + normals[j][n] + normals[k][n]));
      for (const face of [i,j,k]) members[face].push(vertex);
    }
  }
}

const worlds = {2:'amazon',4:'sahara',6:'canyon',7:'glacier',9:'bamboo',10:'alps'};
const shades = ['#285752','#263b35','#436b41','#315c54','#536441','#345952',
  '#365750','#38645e','#25493e','#386444','#345d56','#334d46'];

export const panes = normals.map((normal,i) => {
  const tangent = unit(cross(normal, Math.abs(normal[1]) > .99 ? [1,0,0] : [0,1,0]));
  const bitangent = cross(normal,tangent);
  const angle = v => Math.atan2(dot(v,bitangent),dot(v,tangent));
  return {members:members[i].sort((a,b) => angle(a)-angle(b)), world:worlds[i], tone:shades[i]};
});

export const chapterAngles = [0, 2*step, 4*step];
export const shellViewBox = '-38 -22 503 515';
const elevation = .29, initialYaw = .12;
export function project(pane, angle) {
  const sin = Math.sin(angle+initialYaw), cos = Math.cos(angle+initialYaw);
  const points = pane.members.map(([x,y,z]) => {
    const forward = x*sin + z*cos;
    const depth = forward*Math.cos(elevation) + y*Math.sin(elevation);
    const scale = 224 * 8 / (8-depth);
    return [213 + scale*(x*cos-z*sin), 233 + scale*(forward*Math.sin(elevation)-y*Math.cos(elevation)), depth];
  });
  const area = points.reduce((sum,[x,y],i) => {
    const b = points[(i+1)%points.length];
    return sum + x*b[1] - y*b[0];
  },0);
  return {
    points:points.map(([x,y]) => x.toFixed(2)+','+y.toFixed(2)).join(' '),
    front:area<0, depth:points.reduce((s,p) => s+p[2],0)/points.length
  };
}

// A single pass per visible edge keeps the small-size brand mark evenly weighted.
const edges = new Map();
for (const pane of panes) {
  const view = project(pane,0);
  if (!view.front) continue;
  const points = view.points.split(' ');
  points.forEach((p,i) => {
    const q = points[(i+1)%points.length];
    edges.set([p,q].sort().join(' '),'M'+p+'L'+q);
  });
}
export const markPath = [...edges.values()].join('');

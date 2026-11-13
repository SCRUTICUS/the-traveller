import {markPath,shellViewBox} from '../lib/glass-shell.js';

export function GET() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+shellViewBox+'"><rect x="-38" y="-22" width="503" height="515" rx="65" fill="#171913"/><path d="'+markPath+'" fill="none" stroke="#dbecaa" stroke-width="22" stroke-linecap="round"/></svg>';
  return new Response(svg,{headers:{'Content-Type':'image/svg+xml'}});
}

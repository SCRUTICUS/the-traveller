const config=JSON.parse(document.querySelector('#booking-config').textContent);
const form=document.querySelector('#book-form');
const editor=document.querySelector('[data-booking]');
const ticket=document.querySelector('[data-ticket]');
const dateInput=form.elements.date;
const timeInput=form.elements.time;
const brusselsDate=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'});
const today=brusselsDate.format(new Date());
const tomorrow=new Date(today+'T12:00:00Z'); tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
dateInput.min=today;
dateInput.value=tomorrow.toISOString().slice(0,10);
const params=new URLSearchParams(location.search);
for(const [key,values] of Object.entries({world:config.worlds,city:config.cities,duration:Object.keys(config.prices),time:Array.from(timeInput.options,o=>o.value)})){
  if(values.includes(params.get(key))) form.elements[key].value=params.get(key);
}
if(params.get('date')>=today && /^\d{4}-\d{2}-\d{2}$/.test(params.get('date'))){
  const fallback=dateInput.value;dateInput.value=params.get('date');if(!dateInput.value) dateInput.value=fallback;
}
const formatDate=new Intl.DateTimeFormat(config.locale,{dateStyle:'medium',timeZone:'UTC'});
function showTicket(on){
  ticket.hidden=!on;editor.hidden=on;
}
function update(){
  const state=Object.fromEntries(new FormData(form));
  const world=config.worlds.indexOf(state.world), city=config.cities.indexOf(state.city);
  const prettyDay=state.date && dateInput.validity.valid ? formatDate.format(new Date(state.date+'T12:00:00Z')) : '—';
  const values={world:config.names[world],city:config.cityNames[city],duration:state.duration+' '+config.min,day:prettyDay,time:state.time,price:'€'+config.prices[state.duration]};
  for(const [key,text] of Object.entries(values)) document.querySelectorAll('[data-'+key+']').forEach(node=>node.textContent=text);
  document.querySelectorAll('[data-preview]').forEach(img=>img.src=config.images[world]);
  const query=new URLSearchParams(state);if(!ticket.hidden) query.set('ticket','1');
  history.replaceState(null,'',location.pathname+'?'+query.toString());
}
showTicket(params.get('ticket')==='1' && form.checkValidity());update();
form.addEventListener('input',update);
form.addEventListener('submit',event=>{event.preventDefault();showTicket(true);update();document.querySelector('[data-ticket-title]').focus();window.scrollTo(0,0);});
document.querySelector('[data-edit]').addEventListener('click',()=>{showTicket(false);update();form.querySelector('input:checked').focus();});

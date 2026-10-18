const key='atlas-scroll-v2:'+location.pathname+location.search;
if('scrollRestoration' in history)history.scrollRestoration='manual';
function save(){try{sessionStorage.setItem(key,String(window.scrollY))}catch{}}
function restore(){let y=0;try{y=Number(sessionStorage.getItem(key)||0)}catch{}requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,y)))}
window.addEventListener('pagehide',save);window.addEventListener('pageshow',restore);document.addEventListener('click',e=>{if(e.target.closest('a[href]'))save()});window.addEventListener('scroll',save,{passive:true});

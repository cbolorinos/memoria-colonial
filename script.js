// ===== CURSOR =====
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mX=0,mY=0,rX=0,rY=0;
document.addEventListener('mousemove',e=>{mX=e.clientX;mY=e.clientY;cursorDot.style.left=mX+'px';cursorDot.style.top=mY+'px';});
(function animR(){rX+=(mX-rX)*.12;rY+=(mY-rY)*.12;cursorRing.style.left=rX+'px';cursorRing.style.top=rY+'px';requestAnimationFrame(animR);})();
document.querySelectorAll('a,button,.session-card,.resource-item,.activity-card,.contact-person,.about-feature').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

// ===== LOADER =====
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('hidden'),1800));

// ===== NAV DARK / SCROLL =====
const darkNavPages = ['about.html','resources.html','contact.html','s3.html','s4.html','juegos.html'];
const currentPage  = window.location.pathname.split('/').pop() || 'index.html';
const nav = document.getElementById('nav');

if (darkNavPages.includes(currentPage)) {
  nav.classList.add('dark');
}
window.addEventListener('scroll',()=>{
  if (darkNavPages.includes(currentPage)) { nav.classList.add('dark'); return; }
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open'));

// ===== SCROLL REVEAL =====
function setupReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));
}
setupReveal();

// ===== SLIDER ENGINE =====
function makeSlider(wrapperId, prefix){
  let cur=0;
  const wrap=document.getElementById(wrapperId);
  if(!wrap) return { reset:()=>{} };
  const slides=wrap.querySelectorAll('.slide');
  const total=slides.length;
  const dotsEl=document.getElementById(prefix+'-dots');
  const curEl=document.getElementById(prefix+'-current');

  // Keep the "1 / N" counter in sync with the real slide count
  if(curEl && curEl.parentElement) curEl.parentElement.innerHTML='<span id="'+prefix+'-current">1</span> / '+total;
  const curEl2=document.getElementById(prefix+'-current');

  dotsEl.innerHTML='';
  for(let i=0;i<total;i++){
    const d=document.createElement('div');
    d.className='progress-dot'+(i===0?' active':'');
    d.addEventListener('click',()=>go(i));
    dotsEl.appendChild(d);
  }

  function go(n){
    slides[cur].classList.remove('active'); slides[cur].classList.add('prev');
    const prev=cur; setTimeout(()=>slides[prev].classList.remove('prev'),900);
    cur=(n+total)%total; slides[cur].classList.add('active');
    dotsEl.querySelectorAll('.progress-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
    if(curEl2) curEl2.textContent=cur+1;
  }

  document.getElementById(prefix+'-prev').addEventListener('click',()=>go(cur-1));
  document.getElementById(prefix+'-next').addEventListener('click',()=>go(cur+1));

  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') go(cur-1);
    if(e.key==='ArrowRight') go(cur+1);
  });

  return { reset:()=>go(0) };
}

// Init sliders only on pages that have them
if(document.getElementById('slider1')) makeSlider('slider1','s1');
if(document.getElementById('slider2')) makeSlider('slider2','s2');

// ===== IMAGE LIGHTBOX =====
(function(){
  const imgs=document.querySelectorAll('.slide-img');
  if(!imgs.length) return;
  const lb=document.createElement('div');
  lb.className='lightbox';
  lb.innerHTML='<button class="lightbox-close" aria-label="Cerrar">✕</button><img alt="">';
  document.body.appendChild(lb);
  const lbImg=lb.querySelector('img');
  imgs.forEach(img=>img.addEventListener('click',()=>{
    lbImg.src=img.src; lbImg.alt=img.alt;
    lb.classList.add('open');
  }));
  const close=()=>lb.classList.remove('open');
  lb.addEventListener('click',close);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
})();

// ===== ANIMATED STAT COUNTERS =====
function animStats(){
  document.querySelectorAll('.stat-num').forEach(el=>{
    const t=parseInt(el.textContent); if(isNaN(t)) return;
    let start=0;
    const step=ts=>{
      if(!start) start=ts;
      const p=Math.min((ts-start)/1200,1);
      el.textContent=Math.floor((1-Math.pow(1-p,3))*t);
      if(p<1) requestAnimationFrame(step); else el.textContent=t;
    };
    requestAnimationFrame(step);
  });
}
const sg=document.querySelector('.intro-stat-grid');
if(sg){ const so=new IntersectionObserver(e=>{if(e[0].isIntersecting){animStats();so.disconnect();}},{threshold:.5}); so.observe(sg); }

/**
 * BorneAI — js/main.js
 * Render komponen, interaktivitas, animasi.
 */

/* ── UTILS ── */
function el(tag, attrs={}, html="") {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k==="class") e.className=v;
    else if (k==="style") e.style.cssText=v;
    else e.setAttribute(k,v);
  });
  if (html) e.innerHTML=html;
  return e;
}
function badgeClass(s) {
  if (s==="SIAGA")   return "badge badge-danger";
  if (s==="WASPADA") return "badge badge-warn";
  return "badge badge-ok";
}
function animateCounter(elem, target, dur=1600, suffix="") {
  let start=null;
  const step = ts => {
    if (!start) start=ts;
    const p = Math.min((ts-start)/dur,1);
    const e = 1-Math.pow(1-p,3);
    elem.textContent = Math.floor(e*target).toLocaleString("id-ID")+suffix;
    if (p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function onVisible(sel, cb, threshold=0.2) {
  const targets = document.querySelectorAll(sel);
  if (!targets.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { cb(en.target); obs.unobserve(en.target); } });
  }, { threshold });
  targets.forEach(t => obs.observe(t));
}

/* ── METRICS ── */
function renderMetrics() {
  const c = document.getElementById("metricCards");
  if (!c) return;
  METRICS.forEach(({label,value,color,change,changeClass}) => {
    const card = el("div",{class:"metric"});
    card.innerHTML=`<div class="metric-label">${label}</div><div class="metric-value" style="color:${color}">${value}</div><div class="metric-change ${changeClass}">${change}</div>`;
    c.appendChild(card);
  });
}

/* ── PREDICTIONS ── */
function renderPredictions() {
  const c = document.getElementById("predictionBars");
  if (!c) return;
  PREDICTIONS.forEach(({label,pct,gradient}) => {
    const item = el("div",{class:"pred-item"});
    item.innerHTML=`
      <div class="pred-label"><span>${label}</span><span class="pred-pct">${pct}%</span></div>
      <div class="prediction-bar"><div class="prediction-fill" data-pct="${pct}" style="background:${gradient}"></div></div>`;
    c.appendChild(item);
  });
  onVisible(".ai-box", () => {
    document.querySelectorAll(".prediction-fill").forEach(f => {
      setTimeout(() => { f.style.width = f.dataset.pct+"%"; }, 200);
    });
  });
}

/* ── TABLE ── */
let sortCol=null, sortAsc=true, filteredData=[...PROVINCES];

function renderTable(data) {
  const tbody=document.getElementById("tableBody");
  const info=document.getElementById("tableInfo");
  if (!tbody) return;
  tbody.innerHTML="";
  if (!data.length) {
    tbody.innerHTML=`<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem">Tidak ada data yang sesuai filter.</td></tr>`;
    if (info) info.textContent="0 provinsi ditemukan";
    return;
  }
  data.forEach(({provinsi,aqi,suhu,hutan,hotspot,status}) => {
    const tr=el("tr");
    tr.innerHTML=`
      <td><strong>${provinsi}</strong></td>
      <td class="mono" style="${aqi>100?"color:var(--danger);font-weight:700":""}">${aqi}</td>
      <td class="mono">${suhu.toFixed(1)}°</td>
      <td>${hutan}</td>
      <td class="mono ${hotspot>100?"td-danger":""}">${hotspot}</td>
      <td><span class="${badgeClass(status)}">${status}</span></td>`;
    tbody.appendChild(tr);
  });
  if (info) info.textContent=`Menampilkan ${data.length} dari ${PROVINCES.length} provinsi`;
}

function applyFilters() {
  const search=document.getElementById("searchInput")?.value.toLowerCase()||"";
  const status=document.getElementById("statusFilter")?.value||"";
  filteredData=PROVINCES.filter(p =>
    p.provinsi.toLowerCase().includes(search) && (status===""||p.status===status)
  );
  if (sortCol) {
    filteredData.sort((a,b) => {
      let va=a[sortCol], vb=b[sortCol];
      if (typeof va==="string"&&va.includes("%")) va=parseFloat(va);
      if (typeof vb==="string"&&vb.includes("%")) vb=parseFloat(vb);
      if (typeof va==="string") return sortAsc?va.localeCompare(vb):vb.localeCompare(va);
      return sortAsc?va-vb:vb-va;
    });
  }
  renderTable(filteredData);
}

function initTable() {
  renderTable(PROVINCES);
  document.getElementById("searchInput")?.addEventListener("input",applyFilters);
  document.getElementById("statusFilter")?.addEventListener("change",applyFilters);
  document.getElementById("resetFilter")?.addEventListener("click",()=>{
    document.getElementById("searchInput").value="";
    document.getElementById("statusFilter").value="";
    sortCol=null; sortAsc=true; filteredData=[...PROVINCES];
    renderTable(filteredData);
    document.querySelectorAll(".sort-icon").forEach(i=>i.textContent="⇅");
  });
  document.querySelectorAll("#provinceTable th[data-col]").forEach(th=>{
    th.addEventListener("click",()=>{
      const col=th.dataset.col;
      sortCol===col?(sortAsc=!sortAsc):(sortCol=col,sortAsc=true);
      document.querySelectorAll(".sort-icon").forEach(i=>i.textContent="⇅");
      const icon=th.querySelector(".sort-icon");
      if (icon) icon.textContent=sortAsc?"↑":"↓";
      applyFilters();
    });
  });
}

/* ── NEWS ── */
function renderNews() {
  const c=document.getElementById("newsList");
  if (!c) return;
  NEWS.forEach(({date,title,source,tag,color,tagText}) => {
    const item=el("div",{class:"news-item"});
    item.innerHTML=`
      <div class="news-bar" style="background:${color}"></div>
      <div>
        <div class="news-date">${date}</div>
        <div class="news-title">${title}</div>
        <div class="news-source">Sumber: ${source} &middot;
          <span class="badge badge-ok" style="background:${color}22;color:${tagText||color};border-color:${color}66">${tag}</span>
        </div>
      </div>`;
    c.appendChild(item);
  });
}

/* ── SDG ── */
function renderSDG() {
  const c=document.getElementById("sdgCards");
  if (!c) return;
  SDG_ITEMS.forEach(({icon,iconBg,name,pct,color,barBg,desc,borderColor})=>{
    const card=el("div",{class:"sdg-card",style:`border-top:4px solid ${borderColor}`});
    card.innerHTML=`
      <div class="sdg-icon" style="background:${iconBg}">${icon}</div>
      <h4 class="sdg-name">${name}</h4>
      <div class="sdg-pct" style="color:${color}">${pct}%</div>
      <div class="sdg-bar-bg" style="background:${barBg}">
        <div class="sdg-bar-fill" data-pct="${pct}" style="background:${color}"></div>
      </div>
      <p class="sdg-desc">${desc}</p>`;
    c.appendChild(card);
  });
  onVisible("#sdg",()=>{
    document.querySelectorAll(".sdg-bar-fill").forEach(b=>{
      setTimeout(()=>{ b.style.width=b.dataset.pct+"%"; },200);
    });
  });
}

/* ── HERO COUNTERS ── */
function initHeroCounters() {
  const eP=document.getElementById("stat-provinsi");
  const eS=document.getElementById("stat-sensor");
  const eA=document.getElementById("stat-akurasi");
  if (eP) animateCounter(eP,HERO_COUNTERS.provinsi,900);
  if (eS) animateCounter(eS,HERO_COUNTERS.sensor,1400);
  if (eA) {
    let start=null;
    const t=HERO_COUNTERS.akurasi, dur=1400;
    const step=ts=>{
      if (!start) start=ts;
      const p=Math.min((ts-start)/dur,1), e=1-Math.pow(1-p,3);
      eA.textContent=(e*t).toFixed(1)+"%";
      if (p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/* ── NAVBAR ── */
function initNavbar() {
  const hamburger=document.getElementById("hamburger");
  const navLinks=document.getElementById("navLinks");
  hamburger?.addEventListener("click",()=>navLinks?.classList.toggle("open"));
  navLinks?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));
  const sections=document.querySelectorAll("section[id]");
  const links=document.querySelectorAll(".nav-links a[href^='#']");
  new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting) {
        links.forEach(l=>l.classList.remove("active"));
        document.querySelector(`.nav-links a[href="#${en.target.id}"]`)?.classList.add("active");
      }
    });
  },{rootMargin:"-40% 0px -55% 0px"}).observe(sections[0]||document.body);
  sections.forEach(s=>new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting) {
        links.forEach(l=>l.classList.remove("active"));
        document.querySelector(`.nav-links a[href="#${en.target.id}"]`)?.classList.add("active");
      }
    });
  },{rootMargin:"-40% 0px -55% 0px"}).observe(s));
}

/* ── ALERT ── */
function initAlert() {
  document.getElementById("alertClose")?.addEventListener("click",()=>{
    const s=document.getElementById("alertStrip");
    if (s) { s.style.transition="opacity 0.3s,max-height 0.4s"; s.style.opacity="0"; s.style.maxHeight="0"; s.style.overflow="hidden"; s.style.marginBottom="0"; s.style.padding="0"; }
  });
}

/* ── SCROLL FADE ── */
function initScrollFade() {
  const cards=document.querySelectorAll(".card,.metric,.sdg-card,.ai-box");
  cards.forEach(c=>{ c.style.opacity="0"; c.style.transform="translateY(14px)"; c.style.transition="opacity 0.45s ease,transform 0.45s ease"; });
  new IntersectionObserver((entries,obs)=>{
    entries.forEach((en,i)=>{
      if (en.isIntersecting) {
        setTimeout(()=>{ en.target.style.opacity="1"; en.target.style.transform="translateY(0)"; },i*55);
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.1}).observe(document.body);
  // Observe each card individually
  cards.forEach((c,i)=>{
    new IntersectionObserver((entries,obs)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){
          setTimeout(()=>{ en.target.style.opacity="1"; en.target.style.transform="translateY(0)"; },i%4*60);
          obs.unobserve(en.target);
        }
      });
    },{threshold:0.1}).observe(c);
  });
}

/* ── CLOCK WIB ── */
function initClock() {
  const clock=el("div",{style:`
    position:fixed;bottom:18px;right:18px;
    background:rgba(12,42,74,0.88);color:#38bdf8;
    font-family:'Space Mono',monospace;font-size:0.78rem;
    padding:6px 14px;border-radius:20px;z-index:999;
    backdrop-filter:blur(6px);letter-spacing:0.5px;
    border:1px solid rgba(56,189,248,0.3);
  `});
  document.body.appendChild(clock);
  function update(){
    const wib=new Date(Date.now()+7*3600000);
    const h=String(wib.getUTCHours()).padStart(2,"0");
    const m=String(wib.getUTCMinutes()).padStart(2,"0");
    const s=String(wib.getUTCSeconds()).padStart(2,"0");
    clock.textContent=`🕐 ${h}:${m}:${s} WIB`;
  }
  update(); setInterval(update,1000);
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded",()=>{
  renderMetrics();
  renderPredictions();
  initTable();
  renderNews();
  renderSDG();
  initCharts();
  initMap();
  initHeroCounters();
  initNavbar();
  initAlert();
  initScrollFade();
  initClock();
  console.log("%cBorneAI 🌿 — AI for Climate Monitoring Kalimantan\n%cOpen Source · SDG 13","color:#38bdf8;font-size:14px;font-weight:bold","color:#4e7a96;font-size:11px");
});
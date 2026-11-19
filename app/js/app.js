// VICE ROUTE app shell: loads the data once, wires tabs, filters, drawer, progress.
import { store } from './store.js';
import { renderRoute } from './route.js';
import { renderTracker, setFilter, setQuery } from './tracker.js';
import { renderGuide } from './guide.js';
import { renderSession } from './session.js';
import { renderAudit } from './audit.js';
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const sources = doc.sources;
const $ = id => document.getElementById(id);
const drawer = $('drawer'), scrim = $('scrim');
function openGuide(id) { renderGuide(drawer, scrim, trophies.find(t => t.id === id), sources, store); }
function refresh() {
  const n = store.earned.size;
  $('progress-text').textContent = `${n} of 55 earned · ${Math.round(n / 55 * 100)}% to platinum`;
  $('progress-fill').style.width = (n / 55 * 100) + '%';
  const g = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (store.earned.has(t.id)) g[t.grade]++;
  $('grade-text').textContent = `◆ ${g.platinum} platinum · ● ${g.gold} gold · ● ${g.silver} silver · ● ${g.bronze} bronze`;
  $('chk-spoiler').checked = store.spoiler;
  $('spoiler-state').textContent = store.spoiler ? 'ON — story names masked' : 'OFF';
  renderAudit($('audit-strip'), trophies);
  renderRoute($('view-route'), trophies, store, openGuide);
  renderTracker($('tracker-body'), $('filter-note'), trophies, store, openGuide);
  renderSession($('view-session'), trophies, store, openGuide);
  const sb = $('sources-box');
  sb.replaceChildren();
  const h = document.createElement('b'); h.textContent = 'Sources — every cited step [n] points here'; sb.append(h);
  for (const s of sources) {
    const d = document.createElement('div');
    const a = document.createElement('a'); a.href = s.url; a.textContent = `[${s.n}] ${s.name}`; a.rel = 'noopener';
    d.append(a, ` — ${s.url}`); sb.append(d);
  }
}
document.addEventListener('vr-refresh', refresh);
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === tab));
    for (const v of ['route', 'tracker', 'session']) $('view-' + v).hidden = v !== tab.dataset.tab;
    window.scrollTo(0, 0);
  });
}
for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === chip));
    setFilter(chip.dataset.filter); refresh();
// Land on the Route: the roadmap is the home screen, the Tracker is one tap away.
  });
}
$('search').addEventListener('input', e => { setQuery(e.target.value); refresh(); });
$('chk-spoiler').addEventListener('change', e => { store.setSpoiler(e.target.checked); refresh(); });
$('btn-export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([store.exportJSON()], { type: 'application/json' }));
  a.download = 'vice-route-progress.json'; a.click(); URL.revokeObjectURL(a.href);
});
$('file-import').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try { store.importJSON(await f.text()); refresh(); } catch { alert('That file is not a VICE ROUTE progress export.'); }
});
refresh();

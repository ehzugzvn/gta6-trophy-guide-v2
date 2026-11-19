// VICE ROUTE tracker: dense 55-row table, kind/missable filters, search, citations in every row.
import { displayName, displayDesc } from './store.js';
export let filter = 'all';
export let query = '';
export function setFilter(f) { filter = f; }
export function setQuery(q) { query = q.toLowerCase(); }
export function citationTrail(t) { return [...new Set(t.steps.flatMap(s => s.s))].map(n => `[${n}]`).join(''); }
export function matches(t) {
  if (filter === 'story' && t.kind !== 'story') return false;
  if (filter === 'missable' && t.missable.verdict === 'safe') return false;
  if (filter === 'collectibles' && t.kind !== 'collectibles') return false;
  if (filter === 'activities' && t.kind !== 'activities') return false;
  if (filter === 'coop' && t.kind !== 'coop') return false;
  if (query && !(t.name + ' ' + t.description + ' ' + t.kind).toLowerCase().includes(query)) return false;
  return true;
}
export function renderTracker(tbody, noteEl, trophies, store, openGuide) {
  tbody.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown++;
    const tr = document.createElement('tr');
    const c0 = document.createElement('td');
    const box = document.createElement('input'); box.type = 'checkbox'; box.checked = store.earned.has(t.id);
    box.addEventListener('click', e => e.stopPropagation());
    box.addEventListener('change', () => { store.toggle(t.id); document.dispatchEvent(new Event('vr-refresh')); });
    c0.append(box);
    const c1 = document.createElement('td');
    const gr = document.createElement('span'); gr.className = 'grade g-' + t.grade; gr.textContent = t.grade; c1.append(gr);
    const c2 = document.createElement('td');
    const nm = document.createElement('span'); nm.className = 'tname'; nm.textContent = displayName(t, store);
    const cites = [...new Set(t.steps.flatMap(s => s.s))].map(n => `[${n}]`).join('');
    const ct = document.createElement('span'); ct.className = 'cite'; ct.textContent = ' ' + cites;
    const ds = document.createElement('div'); ds.className = 'tdesc'; ds.textContent = displayDesc(t, store);
    c2.append(nm, ct, ds);
    const c3 = document.createElement('td'); c3.textContent = t.kind === 'coop' ? 'co-op' : t.kind;
    const c4 = document.createElement('td');
    const bd = document.createElement('span'); bd.className = 'badge b-' + t.missable.verdict; bd.textContent = t.missable.verdict;
    const win = document.createElement('div'); win.className = 'tdesc'; win.textContent = t.missable.verdict === 'safe' ? '—' : t.missable.window;
    c4.append(bd, win);
    const c5 = document.createElement('td'); c5.className = 'count'; c5.textContent = t.count ? `${t.count.need} ${t.count.unit}` : '—';
    const c6 = document.createElement('td');
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Guide ›';
    btn.addEventListener('click', e => { e.stopPropagation(); openGuide(t.id); });
    c6.append(btn);
    tr.append(c0, c1, c2, c3, c4, c5, c6);
    tr.addEventListener('click', () => openGuide(t.id));
    tbody.append(tr);
  }
  noteEl.textContent = filter === 'missable'
    ? `Showing ${shown} trophies that can be missed or are at risk — clear these inside their windows.`
    : `Showing ${shown} of 55 trophies. Citation markers [n] in every row match the Sources list below.`;
}

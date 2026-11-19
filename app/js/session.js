// VICE ROUTE session planner: pick a stage, get tonight's ordered checklist.
import { STAGES } from './route.js';
import { displayName } from './store.js';
export function nextUp(list, store) { return list.find(t => !store.earned.has(t.id)) || null; }
export function renderSession(el, trophies, store, openGuide) {
  el.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = 'Tonight\u2019s session: pick a stage and play it top to bottom — story first, then that stage\u2019s collectible sweep. Missable windows are pinned at the top so nothing quietly expires while you play.';
  el.append(intro);
  const grid = document.createElement('div'); grid.className = 'session-grid';
  for (const st of STAGES) {
    const list = trophies.filter(t => t.stage === st.id);
    if (!list.length) continue;
    const ordered = [...list.filter(t => t.kind === 'story'), ...list.filter(t => t.kind !== 'story')];
    const done = list.filter(t => store.earned.has(t.id)).length;
    const card = document.createElement('div'); card.className = 'stage';
    const h = document.createElement('h2'); h.textContent = `${st.title} session`;
    const bar = document.createElement('div'); bar.className = 'progress-bar';
    const fill = document.createElement('div'); fill.id = ''; fill.style.cssText = `height:100%;width:${list.length ? Math.round(done / list.length * 100) : 0}%;background:linear-gradient(90deg,#22d3ee,#ff2e9a)`;
    bar.append(fill);
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `Session progress: ${done}/${list.length} · start here: ${ordered.find(t => !store.earned.has(t.id)) ? displayName(ordered.find(t => !store.earned.has(t.id)), store) : 'stage complete ✓'}`;
    card.append(h, bar, meta);
    for (const t of ordered.filter(x => x.missable.verdict !== 'safe')) {
      const a = document.createElement('div'); a.className = 'alert'; a.textContent = `⚠ Do first — ${t.name}: ${t.missable.window}`; card.append(a);
    }
    for (const t of ordered) {
      const row = document.createElement('div'); row.className = 'trow';
      const box = document.createElement('input'); box.type = 'checkbox'; box.checked = store.earned.has(t.id);
      box.addEventListener('click', e => e.stopPropagation());
      box.addEventListener('change', () => { store.toggle(t.id); document.dispatchEvent(new Event('vr-refresh')); });
      const b = document.createElement('div');
      const nm = document.createElement('span'); nm.className = 'tname'; nm.textContent = displayName(t, store);
      const cites = [...new Set(t.steps.flatMap(s => s.s))].map(n => `[${n}]`).join('');
      const ct = document.createElement('span'); ct.className = 'cite'; ct.textContent = ' ' + cites;
      b.append(nm, ct);
      row.append(box, b); row.addEventListener('click', () => openGuide(t.id));
      card.append(row);
    }
    grid.append(card);
  }
  el.append(grid);
}

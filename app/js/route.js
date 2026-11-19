// VICE ROUTE roadmap: 7 stages in play order, missable windows pinned where they close.
import { displayName, displayDesc } from './store.js';
export const STAGES = [
  { id: 'S0', title: 'S0 · Opening — Gone Fishing', note: 'Learn the controls, finish the opener. Nothing else unlocks yet.' },
  { id: 'S1', title: 'S1 · Chapter 1', note: 'Settle in. Sweep meditation spot #1 the moment it is offered — it never comes back.' },
  { id: 'S2', title: 'S2 · Chapter 2', note: 'Heists open up. Start card sets and vehicle discovery alongside missions.' },
  { id: 'S3', title: 'S3 · Chapter 3', note: 'Vice City proper. Keep making story choices — the 500-choice counter is ticking.' },
  { id: 'S4', title: 'S4 · Chapter 4', note: 'Late story. Finish strand introductions before the finale locks the map state.' },
  { id: 'S5', title: 'S5 · Final Mission + Strands', note: 'Beat the final mission, then close every stranger strand final you opened.' },
  { id: 'S6', title: 'S6 · Post-game Grind & 100%', note: 'Everything left is safe here: stunts, ranges, races, collectibles, money and 100%.' }
];
export function stageOf(t) { return STAGES.find(s => s.id === t.stage) || STAGES[6]; }
export function stageProgress(trophies, store, stageId) {
  const list = trophies.filter(t => t.stage === stageId);
  return { done: list.filter(t => store.earned.has(t.id)).length, total: list.length };
}
export function renderRoute(el, trophies, store, openGuide) {
  el.replaceChildren();
  for (const st of STAGES) {
    const list = trophies.filter(t => t.stage === st.id);
    if (!list.length) continue;
    const done = list.filter(t => store.earned.has(t.id)).length;
    const card = document.createElement('div'); card.className = 'stage';
    const h = document.createElement('h2'); h.textContent = `${st.title} — ${done}/${list.length} earned`; card.append(h);
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = st.note; card.append(meta);
    for (const t of list.filter(x => x.missable.verdict !== 'safe')) {
      const a = document.createElement('div'); a.className = 'alert';
      a.textContent = `⚠ MISSABLE WINDOW — ${t.name}: ${t.missable.window}`;
      card.append(a);
    }
    const sweep = list.filter(t => t.count);
    if (sweep.length) {
      const m = document.createElement('div'); m.className = 'meta';
      m.textContent = 'Sweep in this stage: ' + sweep.map(t => `${t.name} ${t.count.need} ${t.count.unit}`).join(' · ');
      card.append(m);
    }
    for (const t of list) {
      const row = document.createElement('div'); row.className = 'trow';
      const box = document.createElement('input'); box.type = 'checkbox'; box.checked = store.earned.has(t.id);
      box.addEventListener('click', e => e.stopPropagation());
      box.addEventListener('change', () => { store.toggle(t.id); document.dispatchEvent(new Event('vr-refresh')); });
      const body = document.createElement('div');
      const cites = [...new Set(t.steps.flatMap(s => s.s))].map(n => `[${n}]`).join('');
      body.innerHTML = '';
      const nm = document.createElement('span'); nm.className = 'tname'; nm.textContent = displayName(t, store);
      const gr = document.createElement('span'); gr.className = 'grade g-' + t.grade; gr.textContent = t.grade;
      const bd = document.createElement('span'); bd.className = 'badge b-' + t.missable.verdict; bd.textContent = t.missable.verdict;
      const ct = document.createElement('span'); ct.className = 'cite'; ct.textContent = ' ' + cites;
      const ds = document.createElement('div'); ds.className = 'tdesc'; ds.textContent = displayDesc(t, store) + (t.count ? ` — ${t.count.need} ${t.count.unit}` : '');
      body.append(nm, ' ', gr, ' ', bd, ct, ds);
      row.append(box, body);
      row.addEventListener('click', () => openGuide(t.id));
      card.append(row);
    }
    el.append(card);
  }
}

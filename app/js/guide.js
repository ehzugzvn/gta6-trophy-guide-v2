// VICE ROUTE guide drawer: official text, own-words guide, cited steps, sources, honesty notes.
export function hasHonestyNote(t) { return Boolean(t.note); }
export function sourceList(t, sources) {
  return t.sources.map(n => sources.find(s => s.n === n)).filter(Boolean);
}
export function renderGuide(drawer, scrim, t, sources, store) {
  drawer.hidden = false; scrim.hidden = false;
  drawer.replaceChildren();
  const close = document.createElement('button'); close.type = 'button'; close.textContent = '✕ Close guide';
  close.addEventListener('click', () => { drawer.hidden = true; scrim.hidden = true; });
  const h = document.createElement('h2'); h.textContent = t.name;
  const meta = document.createElement('div');
  const gr = document.createElement('span'); gr.className = 'grade g-' + t.grade; gr.textContent = t.grade;
  const bd = document.createElement('span'); bd.className = 'badge b-' + t.missable.verdict; bd.textContent = t.missable.verdict;
  meta.append(gr, ' ', bd, `  ·  kind: ${t.kind}  ·  stage: ${t.stage}` + (t.count ? `  ·  target: ${t.count.need} ${t.count.unit}` : ''));
  const off = document.createElement('div'); off.className = 'official';
  off.innerHTML = '<b>Official description</b>';
  const od = document.createElement('div'); od.textContent = t.description; off.append(od);
  const banner = document.createElement('div'); banner.className = 'banner';
  banner.textContent = t.missable.verdict === 'safe' ? '✓ Safe — this one cannot be missed; do it any time, including post-game.' : `⚠ ${t.missable.verdict.toUpperCase()} — window: ${t.missable.window}`;
  const gh = document.createElement('h3'); gh.textContent = 'Guide (our own words)';
  const gp = document.createElement('p'); gp.textContent = t.guide;
  const sh = document.createElement('h3'); sh.textContent = 'Steps — every specific step is cited';
  const ol = document.createElement('ol');
  for (const s of t.steps) {
    const li = document.createElement('li'); li.textContent = s.t + ' ';
    const c = document.createElement('span'); c.className = 'cite'; c.textContent = s.s.map(n => `[${n}]`).join('');
    li.append(c); ol.append(li);
  }
  drawer.append(close, h, meta, off, banner, gh, gp, sh, ol);
  if (t.note) { const n = document.createElement('div'); n.className = 'note'; n.textContent = '⚖ Sources / certainty: ' + t.note; drawer.append(n); }
  const sb = document.createElement('div'); sb.className = 'sources-box';
  const sbh = document.createElement('b'); sbh.textContent = 'Sources'; sb.append(sbh);
  for (const s of sourceList(t, sources)) {
    const d = document.createElement('div');
    const a = document.createElement('a'); a.href = s.url; a.textContent = `[${s.n}] ${s.name}`; a.rel = 'noopener';
    d.append(a, ` — ${s.url}`); sb.append(d);
  }
  drawer.append(sb);
  const earn = document.createElement('button'); earn.type = 'button';
  earn.textContent = store.earned.has(t.id) ? '✓ Earned — tap to unmark' : 'Mark as earned';
  earn.addEventListener('click', () => { store.toggle(t.id); document.dispatchEvent(new Event('vr-refresh')); renderGuide(drawer, scrim, t, sources, store); });
  drawer.append(earn);
  scrim.onclick = () => { drawer.hidden = true; scrim.hidden = true; };
}

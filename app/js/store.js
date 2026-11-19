// VICE ROUTE store: earned state, spoiler shield, export/import — all local, all offline.
const KEY = 'vice-route-earned-v2';
const SKEY = 'vice-route-spoiler-v2';
export const store = {
  earned: new Set(JSON.parse(localStorage.getItem(KEY) || '[]')),
  spoiler: localStorage.getItem(SKEY) === '1',
  toggle(id) { this.earned.has(id) ? this.earned.delete(id) : this.earned.add(id); this.save(); },
  set(id, on) { on ? this.earned.add(id) : this.earned.delete(id); this.save(); },
  save() { localStorage.setItem(KEY, JSON.stringify([...this.earned])); },
  setSpoiler(on) { this.spoiler = on; localStorage.setItem(SKEY, on ? '1' : '0'); },
  exportJSON() { return JSON.stringify({ app: 'vice-route', earned: [...this.earned].sort((a, b) => a - b) }, null, 1); },
  importJSON(text) {
    const d = JSON.parse(text);
    const arr = Array.isArray(d) ? d : d.earned;
    if (!Array.isArray(arr)) throw new Error('bad file');
    this.earned = new Set(arr.map(Number).filter(n => n >= 1 && n <= 55));
    this.save();
  }
};
export function earnedCount(storeRef) { return storeRef.earned.size; }
export function masked(t, storeRef) {
  // Spoiler shield: story + hidden trophies stay masked until earned.
  return storeRef.spoiler && t.hidden && !storeRef.earned.has(t.id);
}
export function displayName(t, storeRef) { return masked(t, storeRef) ? '??? — hidden trophy (spoiler shield)' : t.name; }
export function displayDesc(t, storeRef) { return masked(t, storeRef) ? 'Description hidden until earned. Turn the shield off or earn it to reveal.' : t.description; }

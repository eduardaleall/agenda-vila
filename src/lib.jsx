import { useEffect, useState } from 'react'
import { BASE, H, MIN, Q } from './data'

// localStorage com proteção: no protótipo, tudo fica salvo só neste navegador.
// Para uso real, troque por uma tabela no Supabase (ou outro back-end).
export const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k)
      return v ? JSON.parse(v) : d
    } catch {
      return d
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v))
      return true
    } catch {
      return false
    }
  },
}

export function useStored(key, initial) {
  const [v, setV] = useState(() => store.get(key, initial))
  useEffect(() => {
    store.set(key, v)
  }, [key, v])
  return [v, setV]
}

// Relógio que atualiza a cada minuto
export function useNow() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), MIN)
    return () => clearInterval(t)
  }, [])
  return now
}

export const recent = (live, now) => live.filter((v) => now - v.t < 60 * MIN)

export function status(live, z, now) {
  const vs = recent(live, now).filter((v) => v.z === z)
  if (!vs.length) return null
  const avg = (k) => {
    let s = 0,
      w = 0
    vs.forEach((v) => {
      if (v[k] == null) return
      const ww = Math.exp(-(now - v.t) / (30 * MIN)) * (1 + (v.c || 0) * 0.5)
      s += v[k] * ww
      w += ww
    })
    return w ? s / w : null
  }
  const n = avg('noise'),
    c = avg('crowd'),
    h = avg('heat')
  const worst = Math.max(n ?? 0, c ?? 0)
  const lab = (x, a) => (x == null ? null : a[x < 0.67 ? 0 : x < 1.34 ? 1 : 2].toLowerCase())
  return {
    n,
    c,
    h,
    k: worst < 0.67 ? 'ok' : worst < 1.34 ? 'mid' : 'bad',
    votes: vs.length,
    txt: [lab(c, Q[1][2]), lab(n, Q[0][2]), lab(h, Q[2][2])].filter(Boolean).join(', '),
  }
}

export function score(votes, z, i) {
  const v = votes[z + '-' + H[i]]
  if (!v || !v.n) return BASE[z][i]
  const user = (v.sum / v.n) * 50
  return Math.round((BASE[z][i] + user * v.n * 2) / (1 + v.n * 2))
}

export const ago = (t, now) => {
  const m = Math.round((now - t) / MIN)
  return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export function Chips({ items, value, onChange, label }) {
  return (
    <div className="row" role="group" aria-label={label}>
      {items.map(([k, l]) => (
        <button key={k} type="button" aria-pressed={k === value} onClick={() => onChange(k)}>
          {l}
        </button>
      ))}
    </div>
  )
}

import { useRef, useState } from 'react'
import { BASE, CANTEIROS, DIAS, MIN, Q, SHAPES, TAGS, Z, ZONES, hourIdx, img, photo } from '../data'
import { ago, recent, score, status, uid } from '../lib'

const COL = { ok: '#a7cf74', mid: '#f2c94c', bad: '#ff8f78' }
const ZBG_W = { corredor: 210, mezanino: 204, deck: 174, jardim: 146 }

function Say({ live, votes, now }) {
  const d = new Date(now),
    h = d.getHours()
  const sts = ZONES.map((z) => [z, status(live, z, now)]).filter((x) => x[1])
  if (sts.length) {
    const by = (x) => Math.max(x[1].n ?? 0, x[1].c ?? 0)
    sts.sort((a, b) => by(a) - by(b))
    const calm = sts[0],
      loud = sts[sts.length - 1]
    if (sts.length > 1 && by(loud) > by(calm))
      return (
        <>
          Pelos votos da última hora, o lugar mais tranquilo é o <em>{Z[calm[0]].n}</em>. O {Z[loud[0]].n} está{' '}
          {loud[1].txt.split(', ')[0]}.
        </>
      )
    return (
      <>
        Pelos votos da última hora, o <em>{Z[calm[0]].n}</em> está {calm[1].txt}.
      </>
    )
  }
  if (h < 7 || h >= 22)
    return (
      <>
        A Vila está <em>fechada ou quase vazia</em> agora. De manhã cedo, o jardim costuma ser o canto mais calmo.
      </>
    )
  const i = hourIdx(h)
  const zs = ZONES.map((z) => [z, score(votes, z, i)]).sort((a, b) => a[1] - b[1])
  return (
    <>
      Ninguém votou ainda nesta hora. Pela estimativa, o mais calmo agora tende a ser o <em>{Z[zs[0][0]].n}</em>. Está
      na Vila? Conte como está.
    </>
  )
}

export default function Agora({ live, setLive, votes, setVotes, confirmed, setConfirmed, now, onPickPlant }) {
  const [pz, setPz] = useState('mezanino')
  const [ans, setAns] = useState({})
  const [tags, setTags] = useState([])
  const [msg, setMsg] = useState('')
  const [flash, setFlash] = useState(false)
  const panelRef = useRef(null)

  const d = new Date(now)
  const clock = `${DIAS[d.getDay()][0].toUpperCase() + DIAS[d.getDay()].slice(1)}, ${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`
  const rec = recent(live, now)
  const st = status(live, pz, now)

  const pick = (z, scrollOnMobile = false) => {
    setPz(z)
    setAns({})
    setTags([])
    setMsg('')
    setFlash(true)
    setTimeout(() => setFlash(false), 550)
    if (scrollOnMobile && window.innerWidth < 960) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
  const prune = (arr) => arr.filter((v) => Date.now() - v.t < 24 * 60 * MIN)

  const submit = (e) => {
    e.preventDefault()
    if (ans.noise == null && ans.crowd == null && ans.heat == null && tags.length === 0) {
      setMsg('Escolha pelo menos uma resposta ou marque o que está rolando.')
      return
    }
    const last = live.filter((v) => v.z === pz && !v.sim && !v.conf).sort((a, b) => b.t - a.t)[0]
    if (last && Date.now() - last.t < 5 * MIN) {
      setMsg(`Você votou nesta área ${ago(last.t, Date.now())}. Espere uns minutinhos ou confirme uma atualização no feed.`)
      return
    }
    const v = { id: uid(), z: pz, t: Date.now(), noise: ans.noise, crowd: ans.crowd, heat: ans.heat, tags, c: 0 }
    setLive((l) => prune([...l, v]))
    if (v.noise != null) {
      const k = pz + '-' + new Date().getHours()
      setVotes((vs) => {
        const o = vs[k] || { sum: 0, n: 0 }
        return { ...vs, [k]: { sum: o.sum + v.noise, n: o.n + 1 } }
      })
    }
    setAns({})
    setTags([])
    setMsg(`Voto registrado no ${Z[pz].n}. Valeu!`)
  }

  const confirm = (v) => {
    if (confirmed[v.id]) return
    setConfirmed((c) => ({ ...c, [v.id]: 1 }))
    setLive((l) =>
      prune([
        ...l.map((x) => (x.id === v.id ? { ...x, c: (x.c || 0) + 1 } : x)),
        { id: v.id + 'c', z: v.z, t: Date.now(), noise: v.noise, crowd: v.crowd, heat: v.heat, conf: 1, sim: v.sim },
      ]),
    )
  }

  const simulate = () => {
    const h = new Date().getHours(),
      i = hourIdx(h),
      add = []
    ZONES.forEach((z) => {
      const base = BASE[z][i] / 50
      for (let k = 0; k < 3; k++) {
        const j = () => Math.max(0, Math.min(2, Math.round(base + (Math.random() - 0.5) * 1.2)))
        add.push({
          id: 's' + Math.random().toString(36).slice(2, 9),
          z,
          t: Date.now() - Math.random() * 55 * MIN,
          noise: j(),
          crowd: j(),
          heat: Math.max(0, Math.min(2, Math.round((h >= 10 && h <= 15 ? 1.6 : 0.8) + (Math.random() - 0.5)))),
          tags: Math.random() < 0.4 ? [TAGS[Math.floor(Math.random() * TAGS.length)]] : [],
          c: Math.floor(Math.random() * 3),
          sim: 1,
        })
      }
    })
    setLive((l) => prune([...l, ...add]))
  }

  const feed = rec.filter((v) => !v.conf).sort((a, b) => b.t - a.t).slice(0, 12)

  return (
    <section className="band" id="agora">
      <div className="wrap">
        <div className="topmeta">
          <div className="clock">{clock}</div>
          <p className="intro">
            Mural comunitário da Vila Universitária (Pituaçu): acompanhe os espaços ao vivo, cuide do jardim e relate problemas.
          </p>
        </div>
        <p id="say" aria-live="polite">
          <Say live={live} votes={votes} now={now} />
        </p>
        <div className="live">
          <div className="mapbox">
            <svg viewBox="0 0 600 430" role="group" aria-label="Esquema da Vila com o estado de cada área">
              <defs>
                <filter id="chalk">
                  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
                </filter>
                {[
                  ['ok', '#a7cf74', 3, 0.55],
                  ['mid', '#f2c94c', 3, 0.6],
                  ['bad', '#ff8f78', 3, 0.65],
                  ['none', '#eeece4', 2, 0.14],
                ].map(([k, c, w, o]) => (
                  <pattern key={k} id={'h-' + k} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                    <line x1="0" y1="0" x2="0" y2="10" stroke={c} strokeWidth={w} opacity={o} />
                  </pattern>
                ))}
              </defs>
              <g filter="url(#chalk)" fill="none" stroke="#eeece4" strokeWidth="2.2" strokeLinecap="round" opacity=".75">
                <path d="M28 120 v-60 q32 -26 64 0 v60" />
                <g opacity=".7">
                  {[112, 196, 280, 364].map((x) => (
                    <rect key={x} x={x} y="86" width="70" height="48" rx="3" />
                  ))}
                  <rect x="448" y="86" width="100" height="48" rx="3" />
                </g>
              </g>
              <text x="60" y="148" className="mlab" textAnchor="middle">entrada</text>
              <text x="330" y="74" className="mlab" textAnchor="middle">lanchonetes</text>
              {ZONES.map((z) => {
                const S = SHAPES[z],
                  s = status(live, z, now)
                const line = s ? s.txt.split(', ').slice(0, 2).join(', ') : 'sem votos'
                return (
                  <g
                    key={z}
                    className={'zone' + (z === pz ? ' on' : '')}
                    tabIndex={0}
                    role="button"
                    aria-label={`${Z[z].s}: ${line}. Votar nesta área`}
                    onClick={() => pick(z, true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        pick(z, true)
                      }
                    }}
                  >
                    <path d={S.d} fill={s ? `url(#h-${s.k})` : 'url(#h-none)'} />
                    <path className="zs" d={S.d} fill="none" filter="url(#chalk)" />
                    {z === 'jardim' && (
                      <>
                        <g fill="none" stroke="#a7cf74" strokeWidth="2" opacity=".8">
                          <circle cx="230" cy="300" r="24" />
                          <circle cx="252" cy="280" r="15" />
                          <path d="M230 324 v14" />
                        </g>
                        <text x="262" y="262" className="mlab" textAnchor="middle" style={{ fontSize: 13, fill: '#a7cf74' }}>
                          mangueira
                        </text>
                        {CANTEIROS.map(([x, y, n]) => (
                          <g
                            key={n}
                            className="cant"
                            onClick={(e) => {
                              e.stopPropagation()
                              onPickPlant(n)
                            }}
                          >
                            <title>{`Canteiro ${n}: conheça a planta`}</title>
                            <rect x={x - 11} y={y - 11} width="22" height="22" rx="3" fill="#22282a" stroke="#a7cf74" strokeWidth="2" />
                            <text x={x} y={y + 5} textAnchor="middle" style={{ font: '700 13px Poppins', fill: '#a7cf74' }}>
                              {n}
                            </text>
                          </g>
                        ))}
                      </>
                    )}
                    <rect className="zbg" x={S.lx - 8} y={S.ly - 21} width={ZBG_W[z]} height={50} rx="6" />
                    <text className="zname" x={S.lx} y={S.ly}>{Z[z].s}</text>
                    <text className="zst" x={S.lx} y={S.ly + 20}>{line}</text>
                  </g>
                )
              })}
            </svg>
            <div className="row zlist" role="group" aria-label="Áreas">
              {ZONES.map((z) => {
                const s = status(live, z, now)
                return (
                  <button key={z} type="button" aria-pressed={z === pz} onClick={() => pick(z, true)}>
                    <i style={{ background: s ? COL[s.k] : '#eeece444' }} />
                    {Z[z].s} · {s ? s.txt : 'sem votos'}
                  </button>
                )
              })}
            </div>
            <div className="keyrow">
              <span><i style={{ background: '#22282a', border: '2px solid #a7cf74' }} />canteiro com placa QR</span>
              <span><i style={{ background: '#a7cf74' }} />tranquilo</span>
              <span><i style={{ background: '#f2c94c' }} />movimentado</span>
              <span><i style={{ background: '#ff8f78' }} />cheio ou barulhento</span>
              <span><i style={{ background: '#eeece444' }} />sem votos na última hora</span>
            </div>
            <p className="proto" style={{ marginTop: 6 }}>
              Esquema da Vila, fora de escala. Toque numa área para votar ou num canteiro para conhecer a planta.
            </p>
          </div>

          <div ref={panelRef} className={'panel' + (flash ? ' flash' : '')}>
            <figure className="taped mini">
              <img src={img(photo(pz, new Date(now).getHours() >= 18))} alt={`Foto do ${Z[pz].n}`} />
            </figure>
            <h3>{Z[pz].s}</h3>
            <div className="pstat">
              {st
                ? `Agora: ${st.txt} · ${st.votes} voto${st.votes > 1 ? 's' : ''} na última hora`
                : 'Ninguém votou nesta área na última hora. Seja a primeira pessoa.'}
            </div>
            <form id="vote" noValidate onSubmit={submit}>
              <div className="qq">
                {Q.map(([k, l, o]) => (
                  <div key={k}>
                    <div className="qt">{l}</div>
                    <div className="row" role="group" aria-label={l}>
                      {o.map((x, i) => (
                        <button
                          key={x}
                          type="button"
                          aria-pressed={ans[k] === i}
                          onClick={() => setAns((a) => ({ ...a, [k]: a[k] === i ? undefined : i }))}
                        >
                          {x}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="qt">
                O que está rolando? <span>(opcional)</span>
              </div>
              <div className="row" id="vtags">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tags.includes(t)}
                    onClick={() => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="row" style={{ marginTop: 16 }}>
                <button type="submit" className="go">Enviar voto</button>
              </div>
              <div id="vmsg" aria-live="polite">{msg}</div>
            </form>
          </div>
        </div>

        <div className="feedwrap">
          <div className="feedhead">
            <h3>Últimas atualizações</h3>
            <span id="vcount">{`${rec.length} voto${rec.length === 1 ? '' : 's'} na última hora`}</span>
          </div>
          <div>
            {feed.length ? (
              feed.map((v) => {
                const parts = [v.crowd != null && Q[1][2][v.crowd], v.noise != null && Q[0][2][v.noise], v.heat != null && Q[2][2][v.heat]]
                  .filter(Boolean)
                  .map((x) => x.toLowerCase())
                  .join(', ')
                return (
                  <div className="fi" key={v.id}>
                    <span className="ago">{ago(v.t, now)}</span>
                    <div>
                      <b>{Z[v.z].s}</b>{parts ? ` · ${parts}` : ' · aviso rápido'}
                      <div>
                        {(v.tags || []).map((t) => (
                          <span className="tg" key={t}>{t}</span>
                        ))}
                        {v.sim ? <span className="tg sim">simulação</span> : null}
                      </div>
                    </div>
                    <button type="button" aria-pressed={!!confirmed[v.id]} onClick={() => confirm(v)}>
                      {confirmed[v.id] ? 'Confirmado' : 'Confirmo'} · {v.c || 0}
                    </button>
                  </div>
                )
              })
            ) : (
              <p>Nenhuma atualização na última hora. Toque numa área do mapa e conte como está.</p>
            )}
          </div>
          <details className="demo-box">
            <summary>Modo demonstração (para testes ou apresentação no Fórum)</summary>
            <div className="row">
              <button type="button" onClick={simulate}>Simular uma hora de movimento</button>
              <button type="button" onClick={() => setLive((l) => l.filter((v) => !v.sim))}>Limpar simulação</button>
            </div>
            <p className="proto" style={{ marginTop: 10 }}>
              Protótipo: os votos ficam salvos só neste navegador. A simulação gera votos marcados como "simulação".
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}

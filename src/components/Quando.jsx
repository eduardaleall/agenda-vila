import { useState } from 'react'
import { H, Z, ZONES, hourIdx } from '../data'
import { Chips, score } from '../lib'

const level = (v) => (v < 34 ? 'calmo' : v < 67 ? 'moderado' : 'barulhento')

export default function Quando({ votes, now }) {
  const [zone, setZone] = useState('corredor')
  const h = new Date(now).getHours()
  const [sel, setSel] = useState(() => (h >= 7 && h <= 22 ? hourIdx(h) : null))
  const vals = H.map((_, i) => score(votes, zone, i))
  let wi = 0
  vals.forEach((v, i) => {
    if (v > vals[wi]) wi = i
  })
  // melhor horário dentro do dia útil (10h às 19h)
  let mid = 3
  for (let i = 3; i < 13; i++) if (vals[i] < vals[mid]) mid = i
  const active = sel ?? mid
  const activeVal = vals[active]
  const total = Object.values(votes).reduce((s, v) => s + v.n, 0)

  return (
    <section className="band azul" id="quando">
      <div className="wrap">
        <h2>Quando ir</h2>
        <p className="lede">
          O barulho é o que mais incomoda na Vila para 73,3% de quem respondeu ao formulário. Veja como cada área costuma
          estar ao longo do dia e toque numa barra para ver o nível por hora.
        </p>
        <div id="ztabs" style={{ marginTop: 18 }}>
          <Chips items={ZONES.map((z) => [z, Z[z].s])} value={zone} onChange={setZone} label="Área da Vila" />
        </div>
        <div className="chart-wrap">
          <div className="chart-guides" aria-hidden="true">
            <span>barulhento</span>
            <span>moderado</span>
            <span>calmo</span>
          </div>
          <div
            className="chart"
            role="group"
            aria-label={`Barulho estimado no ${Z[zone].n} por hora, das 7h às 22h. Mais calmo no meio do dia às ${H[mid]}h, mais barulhento às ${H[wi]}h.`}
          >
            {vals.map((v, i) => (
              <div
                key={i}
                className={'col' + (H[i] === h ? ' cur' : '') + (i === mid ? ' best' : '') + (i === active ? ' sel' : '')}
              >
                <button
                  type="button"
                  className="barbtn"
                  aria-label={`${H[i]}h: nível ${v} de 100 (${level(v)})`}
                  aria-pressed={i === active}
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                >
                  <span style={{ height: Math.max(4, v) + '%' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="hrs">
          {H.map((x, i) => (
            <span key={x} className={i === active ? 'sel' : ''}>
              {x}h
            </span>
          ))}
        </div>
        <div className="chart-tip" aria-live="polite">
          <span>
            <b>{H[active]}h</b> no {Z[zone].n}: índice <b>{activeVal}/100</b> ({level(activeVal)})
          </span>
          <span>
            {H[active] === h ? 'agora · ' : ''}
            {active === mid ? 'melhor horário' : active === wi ? 'horário mais barulhento' : 'toque nas barras para comparar'}
          </span>
        </div>
        <div className="keyrow">
          <span><i />barulho estimado</span>
          <span><i style={{ borderColor: '#f2c94c' }} />agora</span>
          <span><i style={{ background: '#8fb4ef' }} />melhor horário</span>
        </div>
        <div className="verdict">
          <div><b>{H[mid]}h</b>horário mais calmo</div>
          <div><b>{H[wi]}h</b>horário mais barulhento</div>
          <div><b>{total}</b>relatos neste navegador</div>
        </div>
        <p className="proto">
          Ponto de partida: estimativa do grupo a partir do mapa comportamental (10h19 e 20h57) e dos formulários, como
          exemplo. Os votos de barulho da seção "Agora" somam a cada hora.
        </p>
      </div>
    </section>
  )
}

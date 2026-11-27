import { useState } from 'react'
import { NEEDS, PERS, R, Z, ZONES, img, photo } from '../data'
import { Chips, status } from '../lib'

export default function Onde({ live, now }) {
  const [need, setNeed] = useState('descansar')
  const [per, setPer] = useState(() => {
    const h = new Date().getHours()
    return h < 12 ? 'manha' : h < 18 ? 'tarde' : 'noite'
  })
  const [z, why, az, awhy] = R[need][per]
  const st = status(live, z, now)
  const alt =
    st?.k === 'bad'
      ? ZONES.filter((o) => o !== z)
          .map((o) => [o, status(live, o, now)])
          .filter(([, s]) => s && s.k !== 'bad')
          .sort((a, b) => Math.max(a[1].n ?? 0, a[1].c ?? 0) - Math.max(b[1].n ?? 0, b[1].c ?? 0))[0]
      : null

  return (
    <section className="band verde" id="onde">
      <div className="wrap">
        <h2>Onde ficar agora</h2>
        <p className="lede">
          Dois terços pediram espaço para descansar e quase metade reclama do calor. Diga o que você precisa e a gente
          indica o canto certo da Vila.
        </p>
        <div className="pick">
          <div>
            <div className="q">Do que você precisa?</div>
            <Chips items={NEEDS} value={need} onChange={setNeed} label="Do que você precisa" />
            <div className="q">Quando?</div>
            <Chips items={PERS} value={per} onChange={setPer} label="Quando" />
          </div>
          <div className="res" aria-live="polite">
            <figure className="taped">
              <img src={img(photo(z, per === 'noite'))} alt={`Foto do ${Z[z].n}`} loading="lazy" />
            </figure>
            <div>
              <div className="place">{Z[z].s}</div>
              <p>{why}</p>
              <div className="avoid">
                <strong>Evite: {Z[az].n}</strong>
                <br />
                {awhy}
              </div>
              {st && st.k === 'bad' && (
                <>
                  <div className="livewarn">Atenção: pelos votos da última hora, o {Z[z].n} está {st.txt}.</div>
                  {alt ? (
                    <div className="livealt">
                      <strong>Alternativa calma agora: {Z[alt[0]].s}</strong> · pelos votos da última hora, está {alt[1].txt}.
                    </div>
                  ) : (
                    <div className="livealt" style={{ borderColor: 'var(--mute)' }}>
                      Veja o mapa na seção <b>Agora</b> para conferir se outra área já esvaziou.
                    </div>
                  )}
                </>
              )}
              {st && st.k !== 'bad' && (
                <div className="livewarn" style={{ borderColor: 'var(--verde)' }}>Agora, pelos votos: {st.txt}.</div>
              )}
            </div>
          </div>
        </div>
        <p className="proto">
          Recomendações do grupo a partir das fotos, do mapa comportamental e das medições de 23/11 (30 °C às 10h14, 27 °C
          às 20h48).
        </p>
      </div>
    </section>
  )
}

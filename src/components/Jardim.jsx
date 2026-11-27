import { useState } from 'react'
import { DAYS, FEEL, MIN, PL, img } from '../data'
import { store, uid, useStored } from '../lib'

const since = (t, now) => (t ? Math.floor((now - t) / (24 * 60 * MIN)) : null)
const freq = (d) =>
  d === 1 ? 'todo dia' : d === 2 ? 'a cada 2 dias' : d === 3 ? '2x por semana' : d === 7 ? '1x por semana' : `a cada ${d} dias`

function Plants({ curP, setCurP }) {
  const [watered, setWatered] = useStored('vila-water', {})
  const now = Date.now()
  return (
    <>
      <div className="row" role="group" aria-label="Canteiros" style={{ marginTop: 12 }}>
        {[[0, 'Todos'], ...PL.map((p) => [p.n, 'Canteiro ' + p.n])].map(([n, l]) => (
          <button key={n} type="button" aria-pressed={n === curP} onClick={() => setCurP(n)}>
            {l}
          </button>
        ))}
      </div>
      <div className="plants">
        {PL.filter((p) => !curP || p.n === curP).map((p) => {
          const d = since(watered[p.n], now)
          return (
            <article key={p.n} className={'plant' + (p.n === curP ? ' on' : '')} id={'p' + p.n}>
              <span className="tag">{p.n}</span>
              <div className="cn">{p.c}</div>
              <h3>{p.p}</h3>
              <dl>
                <dt>Cuidado</dt>
                <dd>{p.w}</dd>
                <dt>Por que está aqui</dt>
                <dd>{p.y}</dd>
              </dl>
              {p.warn && <div className="warn">{p.warn}</div>}
              <div className="water">
                {d == null ? (
                  <span className="due">Ainda não foi regada por aqui.</span>
                ) : d >= p.dias ? (
                  <span className="due">Última rega há {d} dia{d > 1 ? 's' : ''}: precisa de água.</span>
                ) : (
                  <span className="fine">Regada {d === 0 ? 'hoje' : `há ${d} dia${d > 1 ? 's' : ''}`}.</span>
                )}
                <div className="row">
                  <button type="button" onClick={() => setWatered((w) => ({ ...w, [p.n]: Date.now() }))}>
                    Reguei agora
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function Adopt() {
  const [adopt, setAdopt] = useStored('vila-adopt', {})
  const [name, setName] = useStored('vila-name', '')
  const [owner] = useState(() => {
    const saved = store.get('vila-owner', '')
    if (saved) return saved
    const id = uid()
    store.set('vila-owner', id)
    return id
  })
  const [msg, setMsg] = useState('')
  const nm = name.trim()

  const entry = (v) => (typeof v === 'string' ? { n: v, o: '' } : v)

  const click = (k, plant, day) => {
    const cur = adopt[k] ? entry(adopt[k]) : null
    if (cur) {
      const mine = cur.o ? cur.o === owner : nm && cur.n.toLowerCase() === nm.toLowerCase()
      if (mine) {
        setAdopt((prev) => {
          const { [k]: _, ...rest } = prev
          return rest
        })
        setMsg('Dia liberado para outra pessoa.')
      } else {
        setMsg(`Esse dia já é de ${cur.n}. Escolha outro.`)
      }
      return
    }
    if (!nm) {
      setMsg('Escreva seu primeiro nome antes de adotar.')
      return
    }
    setAdopt((prev) => ({ ...prev, [k]: { n: nm, o: owner } }))
    setMsg(`Valeu, ${nm}! Você rega o canteiro ${plant} toda ${day.toLowerCase()}.`)
  }

  return (
    <>
      <label className="qt adopt-name">
        Seu primeiro nome
        <input
          type="text"
          value={name}
          maxLength={14}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Ana"
        />
      </label>
      <div className="adopt-list" role="region" aria-label="Escala semanal de rega dos canteiros">
        <div className="adopt-head" aria-hidden="true">
          <span>Canteiro e frequência</span>
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        {PL.map((p) => (
          <div key={p.n} className="adopt-row">
            <div className="adopt-plant">
              <b>{p.n} · {p.p}</b>
              <span className="adopt-freq">{freq(p.dias)}</span>
            </div>
            <div className="adopt-days">
              {DAYS.map((d) => {
                const k = p.n + '-' + d
                const cur = adopt[k] ? entry(adopt[k]) : null
                const who = cur?.n
                const mine = cur && (cur.o ? cur.o === owner : nm && cur.n.toLowerCase() === nm.toLowerCase())
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={!!who}
                    aria-label={`${p.p}, ${d}: ${who ? `adotado por ${who}${mine ? ' (seu dia — toque para liberar)' : ''}` : 'disponível para adotar'}`}
                    onClick={() => click(k, p.n, d)}
                  >
                    <small>{d}</small>
                    <span>{who || 'Adotar'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div aria-live="polite" style={{ minHeight: '1.4em', marginTop: 10, color: 'var(--verde)', fontWeight: 600 }}>{msg}</div>
    </>
  )
}

function Feel() {
  const [feels, setFeels] = useStored('vila-feel', [])
  const [a, setA] = useState(null)
  const [b, setB] = useState(null)
  const [msg, setMsg] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (a == null || b == null) {
      setMsg('Responda as duas perguntas.')
      return
    }
    setFeels([...feels, { a, b, t: Date.now() }])
    setA(null)
    setB(null)
    setMsg('Obrigado! Sua resposta entrou na conta.')
  }

  const better = feels.filter((x) => x.b > x.a).length
  const same = feels.filter((x) => x.b === x.a).length
  const worse = feels.length - better - same
  const pc = (x) => Math.round((x / feels.length) * 100)

  const Scale = ({ v, set, label }) => (
    <div className="row" role="group" aria-label={label}>
      {FEEL.map((f, i) => (
        <button key={f} type="button" aria-pressed={v === i} onClick={() => set(i)}>
          {f}
        </button>
      ))}
    </div>
  )

  return (
    <div className="feel">
      <form className="scale" noValidate onSubmit={submit}>
        <div>
          <div className="qt">Como você chegou?</div>
          <Scale v={a} set={setA} label="Como você chegou" />
        </div>
        <div>
          <div className="qt">E agora, depois de uns minutos aqui?</div>
          <Scale v={b} set={setB} label="Como você está agora" />
        </div>
        <div className="row">
          <button type="submit" className="go" style={{ background: 'var(--verde)', borderColor: 'var(--verde)' }}>
            Enviar
          </button>
        </div>
        <div aria-live="polite" style={{ minHeight: '1.4em', color: 'var(--verde)', fontWeight: 600 }}>{msg}</div>
      </form>
      <div className="res2" aria-live="polite">
        {feels.length ? (
          <>
            <b>{pc(better)}%</b>
            <p style={{ marginTop: 6 }}>
              saíram da zona de pausa mais calmos do que chegaram ({feels.length} resposta{feels.length > 1 ? 's' : ''}).
            </p>
            <div className="bars2">
              {[
                ['Mais calmo', better],
                ['Igual', same],
                ['Menos calmo', worse],
              ].map(([l, n]) => (
                <div key={l}>
                  <span>{l}</span>
                  <span className="b" style={{ width: Math.max(2, pc(n)) + '%' }} />
                  <span>{pc(n)}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Ainda não há respostas neste navegador. A sua é a primeira.</p>
        )}
      </div>
    </div>
  )
}

export default function Jardim({ curP, setCurP }) {
  return (
    <section className="band verde" id="jardim">
      <div className="wrap">
        <h2>Jardim da Vila</h2>
        <p className="lede">
          O jardim da mangueira vira zona de pausa: bancos com encosto virados para o verde, canteiros no gramado e uma
          placa QR em cada canteiro. Escaneou a placa? Você caiu aqui.
        </p>
        <div className="zp">
          <figure className="taped">
            <img src={img('jardim-dia')} alt="Jardim da mangueira com bancos azuis e gramado" loading="lazy" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
          </figure>
          <div>
            <div className="sign">
              <b>Zona de pausa</b>
              <span>Fale baixo. Sente, respire, fique.</span>
            </div>
            <p style={{ marginTop: 22 }}>
              É o canto mais calmo da Vila nos dois turnos do mapa comportamental, e o único com sombra de árvore. A ideia é
              simples: dez minutos longe do barulho do corredor.
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <a className="btnlink" href="#planta">Conheça as plantas</a>
              <a className="btnlink" href="#adote">Adote uma planta</a>
              <a className="btnlink" href="#sente">Como você se sente?</a>
            </div>
          </div>
        </div>

        <div className="q" id="planta" style={{ marginTop: 42 }}>Conheça a planta</div>
        <p style={{ margin: 0 }}>Cada canteiro tem um número na placa. Toque no seu canteiro ou escaneie o QR Code.</p>
        <Plants curP={curP} setCurP={setCurP} />
        <p className="proto">Proposta do grupo: espécies rústicas e resistentes ao calor, a confirmar com um viveiro antes do plantio.</p>

        <div className="q" id="adote" style={{ marginTop: 42 }}>Adote uma planta</div>
        <p style={{ margin: 0, maxWidth: '62ch' }}>
          Escreva seu nome, escolha um canteiro e um dia da semana para regar. Quando regar, marque "Reguei agora" no
          cartão da planta para quem vem depois saber. Toque de novo no seu dia para liberar.
        </p>
        <Adopt />

        <div className="q" id="sente" style={{ marginTop: 42 }}>Como você se sente depois?</div>
        <p style={{ margin: 0, maxWidth: '62ch' }}>
          No formulário, 60% disseram que se sentem na Vila de um jeito que "depende do dia". Responda ao chegar e depois de
          dez minutos na zona de pausa: é assim que a gente mede se o jardim funciona.
        </p>
        <Feel />
        <p className="proto">Protótipo: adoções e respostas ficam salvas só neste navegador.</p>
      </div>
    </section>
  )
}

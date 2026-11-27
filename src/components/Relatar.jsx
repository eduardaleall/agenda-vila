import { useRef, useState } from 'react'
import { CATS, SEED, ST, Z, ZONES, img } from '../data'
import { store, useStored } from '../lib'

function resize(file) {
  return new Promise((res) => {
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => {
        const c = document.createElement('canvas'),
          s = Math.min(1, 240 / Math.max(im.width, im.height))
        c.width = im.width * s
        c.height = im.height * s
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
        res(c.toDataURL('image/jpeg', 0.7))
      }
      im.src = r.result
    }
    r.readAsDataURL(file)
  })
}

export default function Relatar() {
  const [mine, setMineState] = useState(() => store.get('vila-reports', []))
  const [seen, setSeen] = useStored('vila-seen', {})
  const [filt, setFilt] = useState('todos')
  const [form, setForm] = useState({ c: 'mesa', z: 'corredor', d: '' })
  const [pending, setPending] = useState('')
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  const setMine = (list) => {
    // se a foto estourar o limite do navegador, salva sem ela
    if (!store.set('vila-reports', list)) {
      list = list.map((r, i) => (i === list.length - 1 ? { ...r, img: '' } : r))
      store.set('vila-reports', list)
    }
    setMineState(list)
  }

  const all = [
    ...mine.map((r, i) => ({ ...r, key: 'm' + i })).reverse(),
    ...SEED.map((r, i) => ({ ...r, img: r.img ? img(r.img) : '', key: 's' + i })),
  ]
    .map((r) => ({ ...r, n: (r.n || 0) + (seen[r.key] ? 1 : 0) }))
    .sort((a, b) => b.n - a.n)
  const counts = { todos: all.length }
  Object.keys(CATS).forEach((k) => (counts[k] = all.filter((r) => r.c === k).length))
  const list = all.filter((r) => filt === 'todos' || r.c === filt)

  const submit = (e) => {
    e.preventDefault()
    setMine([...mine, { ...form, d: form.d.trim().slice(0, 240), s: 'rec', img: pending }])
    setForm({ c: 'mesa', z: 'corredor', d: '' })
    setPending('')
    if (fileRef.current) fileRef.current.value = ''
    setFilt('todos')
    setMsg('Relato recebido. Ele aparece no quadro.')
  }

  return (
    <section className="band amarelo" id="relatar">
      <div className="wrap">
        <h2>Relatar um problema</h2>
        <p className="lede">
          Mesa quebrada, cadeira bamba, mesa no meio da passagem, degrau sem rampa. Só 5,6% acham o mobiliário confortável
          e 46,7% pedem mais acessibilidade. Cada relato entra no quadro e é encaminhado à universidade.
        </p>
        <div className="rep">
          <form noValidate onSubmit={submit}>
            <label>
              O que aconteceu?
              <select value={form.c} onChange={(e) => setForm({ ...form, c: e.target.value })}>
                {Object.entries(CATS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Onde?
              <select value={form.z} onChange={(e) => setForm({ ...form, z: e.target.value })}>
                {ZONES.map((z) => (
                  <option key={z} value={z}>{Z[z].s}</option>
                ))}
              </select>
            </label>
            <label>
              Conte em poucas palavras
              <textarea
                maxLength={240}
                value={form.d}
                onChange={(e) => setForm({ ...form, d: e.target.value })}
                placeholder="Ex.: a cadeira da mesa perto da escada está quebrada"
              />
            </label>
            <label>
              Foto (opcional)
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files[0]
                  setPending(f ? await resize(f) : '')
                }}
              />
            </label>
            <div>
              <button type="submit" className="go">Enviar relato</button>
            </div>
            <div aria-live="polite" style={{ fontWeight: 700 }}>{msg}</div>
          </form>
          <div>
            <div className="row" role="group" aria-label="Filtrar relatos">
              {[['todos', 'Todos'], ...Object.entries(CATS).filter(([k]) => counts[k])].map(([k, l]) => (
                <button key={k} type="button" aria-pressed={k === filt} onClick={() => setFilt(k)}>
                  {l} · {counts[k]}
                </button>
              ))}
            </div>
            <div className="board" style={{ marginTop: 12 }}>
              {list.length ? (
                list.map((r) => {
                  const st = ST[r.s] || ST.rec
                  return (
                    <div className="item" key={r.key}>
                      {r.img ? <img src={r.img} alt="" /> : <div className="ph">sem foto</div>}
                      <div>
                        <h3>{CATS[r.c] || 'Outro problema'}</h3>
                        <div className="meta">
                          {Z[r.z]?.s || ''}
                          {r.seed ? ' · diagnóstico' : ' · seu relato'}
                        </div>
                        <p style={{ margin: '.3em 0' }}>{r.d || 'Sem descrição.'}</p>
                        <span className={'st ' + st[1]}>{st[0]}</span>
                        <div>
                          <button
                            type="button"
                            className="seen"
                            aria-pressed={!!seen[r.key]}
                            onClick={() => setSeen({ ...seen, [r.key]: !seen[r.key] })}
                          >
                            {seen[r.key] ? 'Você também viu' : 'Eu também vi'} · {r.n}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p>Nenhum relato nesta categoria ainda.</p>
              )}
            </div>
          </div>
        </div>
        <div className="route">
          <h3>Como chegar sem degraus</h3>
          <ol>
            <li>Pela entrada principal da Vila, o piso intertravado leva ao corredor central sem degraus.</li>
            <li>No corredor, a rampa com faixa amarela perto da entrada da lanchonete vence o desnível. O piso tem trechos irregulares: vá pelo meio.</li>
            <li>O mezanino tem escada sem corrimão no acesso pelo corredor. A rota sem degraus até ele ainda será confirmada na caminhada da acessibilidade.</li>
          </ol>
        </div>
        <p className="proto">
          Protótipo: os relatos ficam salvos só neste navegador. Os relatos com a marca "diagnóstico" vêm das fotos e das
          respostas abertas do formulário.
        </p>
      </div>
    </section>
  )
}

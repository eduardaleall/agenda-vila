import { EV } from '../data'
import { useStored } from '../lib'

export default function Semana() {
  const [going, setGoing] = useStored('vila-going', {})
  return (
    <section className="band roxo" id="agenda">
      <div className="wrap">
        <h2>Semana Vila Viva</h2>
        <p className="lede">Cada ação responde a um problema que apareceu nos formulários. Datas a definir com a turma.</p>
        <div style={{ marginTop: 24 }}>
          {EV.map((e, i) => (
            <div className="ev" key={e.d}>
              <div className="day">
                {e.d}
                <small>{e.when}</small>
              </div>
              <div>
                <h3>{e.t}</h3>
                <div className="where">{e.where}</div>
                <p style={{ margin: '.4em 0' }}>{e.x}</p>
                <span className="why">
                  Responde a · {e.p[0]}
                  <b>{e.p[1]}</b>
                  {e.p[2]}
                </span>
                <div className="row">
                  <button type="button" aria-pressed={!!going[i]} onClick={() => setGoing({ ...going, [i]: !going[i] })}>
                    {going[i] ? 'Você vai' : 'Quero participar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

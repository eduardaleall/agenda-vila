import { useEffect, useState } from 'react'
import Header from './components/Header'
import Agora from './components/Agora'
import Quando from './components/Quando'
import Onde from './components/Onde'
import Jardim from './components/Jardim'
import Relatar from './components/Relatar'
import Semana from './components/Semana'
import { recent, useNow, useStored } from './lib'

export default function App() {
  const now = useNow()
  // estado compartilhado entre seções: votos ao vivo alimentam o mapa, o "Onde ficar" e o contador do cabeçalho
  const [live, setLive] = useStored('vila-live', [])
  const [votes, setVotes] = useStored('vila-votes', {})
  const [confirmed, setConfirmed] = useStored('vila-conf', {})
  // ?planta=2 no link do QR Code abre direto o canteiro 2
  const [curP, setCurP] = useState(() => +new URLSearchParams(window.location.search).get('planta') || 0)

  useEffect(() => {
    if (curP) setTimeout(() => document.getElementById('planta')?.scrollIntoView(), 300)
    // só na abertura da página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pickPlant = (n) => {
    setCurP(n)
    document.getElementById('planta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header liveCount={recent(live, now).length} />
      <main id="conteudo">
        <Agora
          live={live}
          setLive={setLive}
          votes={votes}
          setVotes={setVotes}
          confirmed={confirmed}
          setConfirmed={setConfirmed}
          now={now}
          onPickPlant={pickPlant}
        />
        <Quando votes={votes} now={now} />
        <Onde live={live} now={now} />
        <Jardim curP={curP} setCurP={setCurP} />
        <Relatar />
        <Semana />
      </main>
      <footer>
        <div className="wrap">
          <p>Projeto de extensão UCSal 65 anos · Impactos do Ambiente Construído na Qualidade de Vida · Profª Elisângela Leão · Campus Pituaçu</p>
        </div>
      </footer>
    </>
  )
}

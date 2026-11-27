import { useEffect, useState } from 'react'

const LINKS = [
  ['agora', 'Agora', 'var(--amarelo)'],
  ['quando', 'Quando ir', 'var(--azul)'],
  ['onde', 'Onde ficar', 'var(--verde)'],
  ['jardim', 'Jardim', 'var(--verde)'],
  ['relatar', 'Relatar', 'var(--amarelo)'],
  ['agenda', 'Semana', 'var(--lilas)'],
]

export default function Header({ liveCount }) {
  const [active, setActive] = useState('agora')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <header>
      <a className="brand" href="#agora" aria-label="Agenda da Vila, início">
        <svg viewBox="0 0 40 40" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 18 L20 7 L34 18" stroke="#eeece4" strokeWidth="2.4" />
          <path d="M10 17 V33 H30 V17" stroke="#eeece4" strokeWidth="2.2" />
          <path d="M20 31 C14 27 14 20 20 15 C26 20 26 27 20 31 Z" stroke="#a7cf74" strokeWidth="2.2" />
          <path d="M20 31 V19" stroke="#a7cf74" strokeWidth="1.8" />
        </svg>
        <span>
          <span className="mark">Agenda da Vila</span>
          <small>Vila Universitária · Campus Pituaçu</small>
        </span>
      </a>
      <nav className="scroll" aria-label="Seções">
        {LINKS.map(([id, label, c]) => (
          <a key={id} href={'#' + id} style={{ '--c': c }} className={active === id ? 'on' : ''}>
            {label}
          </a>
        ))}
      </nav>
      <a className="livepill" href="#agora">
        <i />
        <span>{liveCount ? `${liveCount} voto${liveCount > 1 ? 's' : ''} na última hora` : 'Vila ao vivo'}</span>
      </a>
    </header>
  )
}

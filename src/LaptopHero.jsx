import { useEffect, useRef, useState } from 'react'
import { portfolio } from './content.js'
import './laptop-hero.css'

export default function LaptopHero() {
  const stage = useRef(null)
  const hasOpened = useRef(false)
  const portfolioButton = useRef(null)
  const studioButton = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const { name, role, portrait, email, location, projects } = portfolio
  const project = projects[selected]

  function openWork() {
    hasOpened.current = true
    setIsOpen(true)
  }

  function showStudio() {
    setIsOpen(false)
    studioButton.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function moveProject(step) {
    setSelected((index) => (index + step + projects.length) % projects.length)
  }

  useEffect(() => {
    function onScroll() {
      if (hasOpened.current || (window.location.hash && window.location.hash !== '#top') || !stage.current ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const top = stage.current.getBoundingClientRect().top
      if (top < -42 && top > -window.innerHeight * .48) openWork()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.key === 'Escape' && isOpen) {
      showStudio()
    } else if (isOpen && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      moveProject(event.key === 'ArrowRight' ? 1 : -1)
    } else if (!isOpen && event.target === stage.current && ['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault()
      openWork()
    }
  }

  return (
    <section className="laptop-hero" id="top" ref={stage} tabIndex={-1} onKeyDown={handleKeys} aria-label={`${name} portfolio`}>
      <div className={`studio-stage${isOpen ? ' is-dive' : ''}`}>
        <header className="studio-nav">
          <button ref={studioButton} type="button" className="studio-tag" onClick={showStudio} aria-pressed={!isOpen}>My studio</button>
          <button ref={portfolioButton} type="button" className="studio-tag" onClick={openWork} aria-pressed={isOpen}>Portfolio</button>
          <span className="studio-nav-name" aria-hidden="true">{name}</span>
          <a className="studio-tag" href="#contact">Contact</a>
          <a className="studio-tag studio-tag-accent" href={`mailto:${email}`}>Discuss a project ↗</a>
        </header>

        <div className="studio-scene" aria-hidden={isOpen}>
          <h1 id="studio-name">{name}</h1>
          <img className="studio-portrait" src={portrait} alt={`Portrait of ${name}`} fetchPriority="high" />
          <p className="studio-script">{role}</p>
          <div className="studio-id" aria-hidden="true">
            <div className="studio-id-card">
              <strong>Designer card</strong>
              <img src={portrait} alt="" />
              <span>{name}</span><span>{location}</span>
            </div>
          </div>
        </div>

        <button type="button" className="studio-device" onClick={isOpen ? () => moveProject(1) : openWork}
          aria-label={isOpen ? 'Show next project' : 'Zoom into the laptop and explore portfolio'}>
          <span className="studio-lid">
            <span className="studio-screen">
              <img key={project.slug} src={project.cover.src} alt="" />
            </span>
          </span>
          <span className="studio-base" aria-hidden="true" />
        </button>

        <div className="studio-case" inert={!isOpen} aria-hidden={!isOpen}>
          <div className="studio-case-copy" aria-live="polite" aria-atomic="true">
            <div className="studio-ticket" key={project.slug}>
              <p>{String(selected + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
              <h2>{project.title}</h2>
              <p>{project.type}</p>
            </div>
            <p className="studio-case-description" key={project.description}>{project.description}</p>
          </div>
          <div className="studio-case-controls">
            <button type="button" onClick={() => moveProject(-1)} aria-label="Previous project">←</button>
            <a href={`#/work/${project.slug}`}>View gallery ↗</a>
            <button type="button" onClick={() => moveProject(1)} aria-label="Next project">→</button>
          </div>
        </div>

        <a className="studio-archive" href="#work" inert={!isOpen}>View all work ↓</a>
        <button type="button" className="studio-hint" onClick={() => {
          openWork()
          portfolioButton.current?.focus({ preventScroll: true })
        }} inert={isOpen}>Scroll into the work <span aria-hidden="true">↓</span></button>
      </div>
    </section>
  )
}

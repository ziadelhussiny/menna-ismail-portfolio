import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { portfolio } from './content.js'
import './laptop-hero.css'

export default function LaptopHero() {
  const stage = useRef(null)
  const portfolioButton = useRef(null)
  const studioButton = useRef(null)
  const nextInput = useRef(0)
  const gesture = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const { name, role, portrait, email, location, projects } = portfolio
  const inquiryLink = `mailto:${email}?subject=${encodeURIComponent('New project inquiry')}`
  const project = projects[selected]
  const alternate = project.gallery.find(({ src }) => src !== project.cover.src)

  function openWork() {
    if (isOpen) return
    nextInput.current = performance.now() + 1050
    setSelected(0)
    setIsOpen(true)
  }

  function showStudio() {
    setIsOpen(false)
    studioButton.current?.focus({ preventScroll: true })
    nextInput.current = performance.now() + 850
  }

  function moveProject(step) {
    if (step < 0 && selected === 0) {
      showStudio()
      return
    }
    setSelected((index) => (index + step + projects.length) % projects.length)
  }

  function navigate(step) {
    if (!isOpen) {
      if (step > 0) openWork()
      return
    }
    moveProject(step)
  }

  const wheelNavigate = useEffectEvent((event) => {
    if (event.ctrlKey || event.metaKey) return
    const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    if (Math.abs(distance) < (event.deltaMode ? 1 : 18)) return
    event.preventDefault()
    const now = performance.now()
    if (now < nextInput.current) return
    nextInput.current = now + 720
    navigate(Math.sign(distance))
  })

  useEffect(() => {
    const element = stage.current
    const onWheel = (event) => wheelNavigate(event)
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [])

  function handleKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.key === 'Escape' && isOpen) {
      showStudio()
      return
    }
    if (event.repeat || (event.key === ' ' && event.target.closest('button, a'))) return
    const next = ['ArrowDown', 'PageDown', 'ArrowRight', ' '].includes(event.key)
    const previous = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key)
    if (next || previous) {
      event.preventDefault()
      navigate(next ? 1 : -1)
    }
  }

  function finishSwipe(event) {
    const start = gesture.current
    gesture.current = null
    if (!start || event.touches.length !== 0) return
    const end = event.changedTouches[0]
    const horizontal = start.clientX - end.clientX
    const vertical = start.clientY - end.clientY
    const distance = Math.abs(horizontal) > Math.abs(vertical) ? horizontal : vertical
    if (Math.abs(distance) >= 40 && performance.now() >= nextInput.current) {
      nextInput.current = performance.now() + 650
      navigate(Math.sign(distance))
    }
  }

  return (
    <section className="laptop-hero" id="top" ref={stage} tabIndex={-1} onKeyDown={handleKeys}
      onTouchStart={({ touches }) => { gesture.current = touches.length === 1 ? touches[0] : null }}
      onTouchCancel={() => { gesture.current = null }} onTouchEnd={finishSwipe}
      aria-label={`${name} portfolio`}>
      <div className={`studio-stage${isOpen ? ' is-dive' : ''}`}>
        <header className="studio-nav">
          <button ref={studioButton} type="button" className="studio-tag" onClick={showStudio} aria-pressed={!isOpen}>My studio</button>
          <button ref={portfolioButton} type="button" className="studio-tag" onClick={openWork} aria-pressed={isOpen}>Portfolio</button>
          <span className="studio-nav-name" aria-hidden="true">{name}</span>
          <a className="studio-tag" href="#contact">Contact</a>
          <a className="studio-tag studio-tag-accent" href={inquiryLink}>Discuss a project ↗</a>
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
              <span className="studio-screen-reel" key={project.slug}>
                <img src={project.cover.src} alt="" />
                {isOpen && alternate && <img className="studio-screen-alternate" src={alternate.src} alt="" />}
              </span>
              {isOpen && <span className="studio-screen-flash" key={`flash-${project.slug}`} aria-hidden="true" />}
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

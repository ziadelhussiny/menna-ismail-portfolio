import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { portfolio as data } from './content.js'

const Arrow = () => <span aria-hidden="true">↗</span>

function Reveal({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && node.classList.add('is-visible'),
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ number, children }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <i />
      <p>{children}</p>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const links = ['Approach', 'About', 'Services', 'Work', 'Contact']

  function handleEscape(event) {
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header className="site-header" onKeyDown={handleEscape}>
      <a className="logo" href="#top" aria-label={`${data.name} home`}>
        {data.name}
      </a>
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="main-navigation"
      >
        <span />
        <span />
      </button>
      <nav id="main-navigation" className={open ? 'nav is-open' : 'nav'} aria-label="Main navigation">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>
            {link}
          </a>
        ))}
      </nav>
      <a className="pill header-cta" href="#contact">
        Let’s talk
      </a>
    </header>
  )
}

function Hero({ animateEntrance }) {
  return (
    <section className={animateEntrance ? 'hero hero-entering' : 'hero'} id="top" tabIndex={-1}>
      <img className="hero-portrait" src={data.portrait} alt={`Portrait of ${data.name}`} fetchPriority="high" />
      <div className="hero-shade" />
      <Header />
      <div className="hero-content">
        <div className="eyebrow"><i />{data.hero.eyebrow}</div>
        <h1>
          <span>{data.hero.titleTop}</span>
          <em>{data.hero.titleAccent}</em>
        </h1>
        <p>{data.hero.intro}</p>
        <div className="hero-actions">
          <a className="pill pill-light" href="#work">View work</a>
          <a className="pill pill-ghost" href="#contact">Start a project</a>
        </div>
      </div>
      <div className="scroll-cue"><span>SCROLL</span><i /></div>
    </section>
  )
}

function Approach() {
  const words = data.approach.split(' ')

  return (
    <section className="approach" id="approach" tabIndex={-1}>
      <div className="approach-sticky">
        <SectionLabel number="★">Approach</SectionLabel>
        <p className="approach-copy">
          <span className="visually-hidden">{data.approach}</span>
          {words.map((word, index) => (
            <span className="approach-word" aria-hidden="true" key={index} style={{
              '--word-start': `${index / words.length * 94}%`,
              '--word-end': `${index / words.length * 94 + 6}%`,
            }}>{word}{' '}</span>
          ))}
        </p>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about" tabIndex={-1}>
      <SectionLabel number="01">About</SectionLabel>
      <div className="about-grid">
        <Reveal><h2>{data.about.title}</h2></Reveal>
        <Reveal className="about-copy">
          {data.about.copy.map((copy) => <p key={copy}>{copy}</p>)}
          <div className="principles">{data.about.principles.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
      </div>
      <div className="education"><h3>Education</h3><p>{data.about.education} · {data.about.graduation}</p></div>
    </section>
  )
}

function Services() {
  return (
    <section className="section services" id="services" tabIndex={-1}>
      <SectionLabel number="02">Services</SectionLabel>
      <div className="services-intro">
        <Reveal><h2>What I do</h2></Reveal>
        <Reveal><p>{data.tools.join(' · ')}</p></Reveal>
      </div>
      <div className="service-cloud">
        {data.services.map((service, index) => <span key={service} className={index % 3 === 0 ? 'is-solid' : ''}>{service}</span>)}
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="work" id="work" tabIndex={-1}>
      <div className="section work-head">
        <SectionLabel number="03">Selected Work</SectionLabel>
        <Reveal><h2>My Work</h2></Reveal>
      </div>
      <div className="project-list">
        {data.projects.map((project) => (
          <article className="project" key={project.title}>
            <div className="project-meta section">
              <span className="project-number">{project.number}</span>
              <div><h3>{project.title}</h3><p>{project.type}</p></div>
              <div className="project-tools"><p>{project.description}</p></div>
            </div>
            <Reveal>
              <a className="project-visual" href={`#/work/${project.slug}`} aria-label={`View ${project.title}`}>
                <img src={project.cover.src} alt={project.cover.title} loading="lazy" />
                <span className="project-link">View gallery <Arrow /></span>
              </a>
            </Reveal>
          </article>
        ))}
      </div>
      <div className="more-work"><p>Have a project in mind?</p><a href="#contact">Let’s talk <Arrow /></a></div>
    </section>
  )
}

function ProjectPage({ project }) {
  const headingRef = useRef(null)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    headingRef.current?.focus({ preventScroll: true })
  }, [project])

  return (
    <main className="case-page">
      <div className="section case-content">
        <a className="pill" href="#work">← Back to work</a>
        <p className="eyebrow">{project ? project.type : 'Selected Work'}</p>
        <h1 ref={headingRef} tabIndex={-1}>{project?.title ?? 'Project unavailable'}</h1>
        {project && (
          <>
            <p>{project.description}</p>
            <div className="case-gallery">
              {project.gallery.map(({ src, title }, index) => (
                <figure key={src}>
                  <img src={src} alt={`Design work for ${title}`} loading={index === 0 ? 'eager' : 'lazy'} />
                  <figcaption>{title}</figcaption>
                </figure>
              ))}
            </div>
            <a className="pill" href="#work">← Back to work</a>
          </>
        )}
      </div>
    </main>
  )
}

function Contact() {
  return (
    <>
      <section className="section contact" id="contact" tabIndex={-1}>
        <SectionLabel number="04">Contact</SectionLabel>
        <Reveal><h2>Have something <em>in mind?</em></h2></Reveal>
        <a className="contact-email" href={`mailto:${data.email}`}>{data.email}<Arrow /></a>
        <a className="contact-phone" href={`tel:${data.phone}`}>{data.phoneLabel}</a>
      </section>
      <footer>
        <div className="footer-marquee" aria-hidden="true"><span>Let’s talk</span><span>Let’s talk</span><span>Let’s talk</span></div>
        <div className="footer-grid section">
          <div><a className="logo" href="#top">{data.name}</a><p>{data.role}</p></div>
          <p>{data.location}</p>
        </div>
        <div className="footer-bottom section"><span>© 2026 {data.name}</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </>
  )
}

function Intro({ entered, onEnter }) {
  const buttonRef = useRef(null)
  useEffect(() => {
    document.body.classList.toggle('is-locked', !entered)
    if (!entered) buttonRef.current?.focus()
    return () => document.body.classList.remove('is-locked')
  }, [entered])

  return (
    <div className={entered ? 'intro is-gone' : 'intro'} inert={entered}>
      <div className="intro-ribbon" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => (
        <span key={index}>{data.name} · </span>
      ))}</div>
      <div className="intro-top"><span className="logo">{data.name}</span><span>Portfolio · 2026</span></div>
      <div className="intro-title">{data.name}<span>{data.role}</span></div>
      <button type="button" ref={buttonRef} onClick={onEnter}>Enter portfolio <Arrow /></button>
    </div>
  )
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const [entered, setEntered] = useState(() => Boolean(window.location.hash))
  const [animateEntrance, setAnimateEntrance] = useState(false)
  const mainRef = useRef(null)
  const isProject = hash.startsWith('#/work/')
  const wasProject = useRef(isProject)
  const project = isProject ? data.projects.find(({ slug }) => hash === `#/work/${slug}`) : null

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash)
      if (window.location.hash) setEntered(true)
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useLayoutEffect(() => {
    const returningFromGallery = wasProject.current && !isProject
    wasProject.current = isProject
    if (!entered || isProject) return
    const target = hash ? document.getElementById(hash.slice(1)) : mainRef.current
    if (!target) return
    target.focus({ preventScroll: true })
    if (hash) target.scrollIntoView({ behavior: returningFromGallery ? 'instant' : 'auto' })
  }, [entered, hash, isProject])

  if (isProject) return <ProjectPage key={hash} project={project} />

  return (
    <>
      <Intro entered={entered} onEnter={() => {
        setAnimateEntrance(true)
        setEntered(true)
      }} />
      <div inert={!entered}>
        <main ref={mainRef} tabIndex={-1}><Hero animateEntrance={animateEntrance && !hash} /><Approach /><About /><Services /><Work /><Contact /></main>
      </div>
    </>
  )
}

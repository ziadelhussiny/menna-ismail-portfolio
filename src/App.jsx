import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { portfolio as data } from './content.js'
import LaptopHero from './LaptopHero.jsx'

const Arrow = () => <span aria-hidden="true">↗</span>

function Reveal({ as: Element = 'div', children, className = '', stagger = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return
    node.classList.add('is-watching')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.classList.add('is-visible')
        observer.disconnect()
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Element ref={ref} className={`reveal${stagger ? ' reveal-stagger' : ''} ${className}`}>
      {children}
    </Element>
  )
}

function SectionLabel({ number, children }) {
  return (
    <Reveal className="section-label" stagger>
      <span>{number}</span>
      <i />
      <p>{children}</p>
    </Reveal>
  )
}

function About() {
  return (
    <section className="section about" id="about" tabIndex={-1}>
      <SectionLabel number="01">About</SectionLabel>
      <div className="about-grid">
        <Reveal><h2>{data.about.title}</h2></Reveal>
        <Reveal className="about-copy" stagger>
          <p>{data.approach}</p>
          {data.about.copy.map((copy) => <p key={copy}>{copy}</p>)}
          <div className="principles">{data.about.principles.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
      </div>
      <Reveal className="education" stagger><h3>Education</h3><p>{data.about.education} · {data.about.graduation}</p></Reveal>
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
      <Reveal className="service-cloud" stagger>
        {data.services.map((service, index) => <span key={service} className={index % 3 === 0 ? 'is-solid' : ''}>{service}</span>)}
      </Reveal>
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
            <Reveal className="project-meta section" stagger>
              <span className="project-number">{project.number}</span>
              <div><h3>{project.title}</h3><p>{project.type}</p></div>
              <div className="project-tools"><p>{project.description}</p></div>
            </Reveal>
            <Reveal>
              <a className="project-visual" href={`#/work/${project.slug}`} aria-label={`View ${project.title}`}>
                <img src={project.cover.src} alt={project.cover.title} loading="lazy" />
                <span className="project-link">View gallery <Arrow /></span>
              </a>
            </Reveal>
          </article>
        ))}
      </div>
      <Reveal className="more-work" stagger><p>Have a project in mind?</p><a href="#contact">Let’s talk <Arrow /></a></Reveal>
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
                <Reveal as="figure" className={index === 0 ? 'case-lead' : 'case-frame'} key={src} stagger={index !== 0}>
                  <img src={src} alt={`Design work for ${title}`} loading={index === 0 ? 'eager' : 'lazy'} />
                  <figcaption>{title}</figcaption>
                </Reveal>
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
        <Reveal className="contact-links" stagger>
          <a className="contact-email" href={`mailto:${data.email}`}>{data.email}<Arrow /></a>
          <a className="contact-phone" href={`tel:${data.phone}`}>{data.phoneLabel}</a>
        </Reveal>
      </section>
      <footer>
        <div className="footer-cta">
          <Reveal className="section" stagger>
            <a className="footer-cta-link" href={`mailto:${data.email}`}>
              <span>Let’s talk</span>
              <span className="footer-cta-icon"><Arrow /></span>
            </a>
          </Reveal>
        </div>
        <Reveal className="footer-grid section" stagger>
          <div><a className="logo" href="#top">{data.name}</a><p>{data.role}</p></div>
          <p>{data.location}</p>
        </Reveal>
        <Reveal className="footer-bottom section" stagger><span>© 2026 {data.name}</span><a href="#top">Back to top ↑</a></Reveal>
      </footer>
    </>
  )
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const isProject = hash.startsWith('#/work/')
  const isStudio = !hash || hash === '#top'
  const project = isProject ? data.projects.find(({ slug }) => hash === `#/work/${slug}`) : null

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useLayoutEffect(() => {
    if (isProject) return
    const target = document.getElementById(isStudio ? 'top' : hash.slice(1))
    if (!target) return
    target.focus({ preventScroll: true })
    if (isStudio) window.scrollTo({ top: 0, behavior: 'instant' })
    else target.scrollIntoView({ behavior: 'instant' })
  }, [hash, isProject, isStudio])

  if (isProject) return <ProjectPage key={hash} project={project} />
  if (isStudio) return <main className="studio-home"><LaptopHero /></main>

  return (
    <main className="studio-archive-page">
      <nav className="section archive-nav" aria-label="Portfolio archive">
        <a href="#top">← Back to studio</a><a href="#work">Works</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a>
      </nav>
      <About />
      <Services />
      <Work />
      <Contact />
    </main>
  )
}

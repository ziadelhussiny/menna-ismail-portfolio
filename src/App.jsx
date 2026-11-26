import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { portfolio as data } from './content.js'
import LaptopHero from './LaptopHero.jsx'

const Arrow = () => <span aria-hidden="true">↗</span>

function Reveal({ as: Element = 'div', children, className = '' }) {
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
    <Element ref={ref} className={`reveal ${className}`}>
      {children}
    </Element>
  )
}

const archiveLinks = [
  ['#work', 'Works'],
  ['#about', 'About'],
  ['#services', 'Services'],
  ['#contact', 'Contact'],
]

function ArchiveNav({ active }) {
  return (
    <nav className="archive-nav" aria-label="Studio navigation">
      <a className="archive-tag archive-back" href="#top">← Studio</a>
      <div className="archive-nav-links">
        {archiveLinks.map(([href, label]) => (
          <a className="archive-tag" key={href} href={href} aria-current={href === active ? 'page' : undefined}>{label}</a>
        ))}
      </div>
    </nav>
  )
}

function ArchiveHeading({ label, title, children }) {
  return (
    <header className="archive-heading">
      <p className="archive-label">{label}</p>
      <h1 id="archive-title" tabIndex={-1}>{title}</h1>
      {children}
    </header>
  )
}

function Work() {
  return (
    <>
      <ArchiveHeading label="Menna Ismail" title="Project archive" />
      <div className="archive-grid">
        {data.projects.map((project) => (
          <Reveal as="article" className="archive-catalogue" key={project.slug}>
            <a href={`#/work/${project.slug}`}>
              <div className="archive-cover">
                <img src={project.cover.src} alt="" loading="lazy" />
              </div>
              <div className="archive-ticket">
                <span className="archive-index">{project.number}</span>
                <div><h2>{project.title}</h2><p>{project.type}</p></div>
                <span className="archive-arrow"><Arrow /></span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </>
  )
}

function ProjectPage({ project }) {
  const nextProject = project && data.projects[(data.projects.indexOf(project) + 1) % data.projects.length]
  return (
    <>
      <div className="archive-case-intro">
        <ArchiveHeading label={project?.type ?? 'Project archive'} title={project?.title ?? 'Project unavailable'}>
          {project && <p className="archive-description">{project.description}</p>}
        </ArchiveHeading>
        {project && <div className="archive-ticket case-ticket"><span className="archive-index">{project.number}</span><div><p>Project files</p><strong>{project.gallery.length} {project.gallery.length === 1 ? 'image' : 'images'}</strong></div></div>}
      </div>
      {project && (
        <>
          <div className="archive-grid archive-frames">
            {project.gallery.map(({ src, title }, index) => (
              <Reveal as="figure" className="archive-frame" key={src}>
                <div className="archive-cover"><img src={src} alt={`Design work for ${title}`} loading={index === 0 ? 'eager' : 'lazy'} /></div>
                <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{title}</figcaption>
              </Reveal>
            ))}
          </div>
          <div className="archive-case-actions">
            <a className="archive-tag" href="#work">← All projects</a>
            <a className="archive-tag" href={`#/work/${nextProject.slug}`}>Next · {nextProject.title} <Arrow /></a>
          </div>
        </>
      )}
    </>
  )
}

function About() {
  return (
    <>
      <ArchiveHeading label="Designer profile" title={data.about.title} />
      <div className="archive-profile">
        <aside className="archive-profile-card">
          <img src={data.portrait} alt={`Portrait of ${data.name}`} />
          <div className="archive-ticket"><div><h2>{data.name}</h2><p>{data.role} · {data.location}</p></div></div>
        </aside>
        <div className="archive-panel">
          <p>{data.approach}</p>
          {data.about.copy.map((copy) => <p key={copy}>{copy}</p>)}
          <h2>Education</h2>
          <p>{data.about.education} · {data.about.graduation}</p>
          <ul className="archive-skills">{data.about.principles.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </>
  )
}

function Services() {
  return (
    <>
      <ArchiveHeading label="Menna Ismail" title="Studio services" />
      <div className="archive-panel">
        <ul className="archive-services">{data.services.map((service) => <li key={service}>{service}</li>)}</ul>
        <h2>Tools</h2>
        <p>{data.tools.join(' · ')}</p>
        <a className="archive-tag" href="#contact">Discuss a project <Arrow /></a>
      </div>
    </>
  )
}

function Contact() {
  return (
    <>
      <ArchiveHeading label="Contact" title="Let’s talk" />
      <div className="archive-profile archive-contact">
        <div className="archive-panel contact-panel">
          <p>{data.role} · {data.location}</p>
          <a href={`mailto:${data.email}`}>{data.email} <Arrow /></a>
          <a href={`tel:${data.phone}`}>{data.phoneLabel} <Arrow /></a>
        </div>
        <div className="archive-ticket case-ticket"><div><h2>{data.name}</h2><p>{data.role}</p></div></div>
      </div>
    </>
  )
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const isProject = hash.startsWith('#/work/')
  const isStudio = !hash || hash === '#top'
  const project = isProject ? data.projects.find(({ slug }) => hash === `#/work/${slug}`) : null
  const active = archiveLinks.some(([href]) => href === hash) ? hash : '#work'

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById(isStudio ? 'top' : 'archive-title')?.focus({ preventScroll: true })
  }, [hash, isStudio])

  if (isStudio) return <main className="studio-home"><LaptopHero /></main>

  return (
    <main className="studio-archive-page" key={hash}>
      <ArchiveNav active={active} />
      <div className="archive-body">
        {isProject ? <ProjectPage project={project} /> : (
          active === '#about' ? <About /> : active === '#services' ? <Services /> : active === '#contact' ? <Contact /> : <Work />
        )}
      </div>
    </main>
  )
}

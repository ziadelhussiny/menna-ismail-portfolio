const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`

export const portfolio = {
  name: 'Menna Ismail',
  role: 'Graphic Designer',
  email: 'Mennaismail478@gmail.com',
  phone: '+201018383639',
  phoneLabel: '+20 10 1838 3639',
  location: 'Ismailia, Egypt',
  portrait: publicAsset('menna-portrait-cutout.webp'),
  hero: {
    eyebrow: 'Graphic Designer · Ismailia, Egypt',
    titleTop: 'Menna',
    titleAccent: 'Ismail',
    intro: 'Graphic design, brand identities, and campaign visuals for clients in Egypt and Saudi Arabia.',
  },
  approach: 'I create distinctive visuals that communicate a clear message, giving each client a style that fits their ideas.',
  about: {
    title: 'Hello, I’m Menna.',
    copy: [
      'I’m a graphic designer based in Ismailia, Egypt, with about two years of experience in visual identity, graphic design, and video editing.',
      'I’m always exploring new trends and ways to bring a distinct visual style to each project.',
    ],
    principles: ['Creativity', 'Layout', 'Typography', 'Time management', 'Quick learning', 'Communication', 'Teamwork', 'Adaptability', 'Problem solving'],
    education: 'Faculty of Art Education, Suez Canal University',
    graduation: '2023',
  },
  services: ['Social media design', 'Campaign visuals', 'Logo & visual identity', 'Menu design', 'Video editing'],
  tools: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'InDesign'],
}

const number = (value) => String(value).padStart(2, '0')
const archivedArtwork = (page, title) => ({ src: publicAsset(`work/page-${page}.webp`), title })

function archivedProject(category, project, images) {
  return {
    ...project,
    category,
    collections: [{ title: 'Project gallery', images }],
    imageCount: images.length,
  }
}

function collection(directory, count, title, label) {
  return {
    title,
    images: Array.from({ length: count }, (_, index) => ({
      src: publicAsset(`work/${directory}/${number(index + 1)}.webp`),
      title: `${label} ${number(index + 1)}`,
    })),
  }
}

function project(category, id, title, count, description, extra = []) {
  const primary = {
    branding: ['Brand identity', 'Identity presentation', 'Slide'],
    'social-media': ['Social media', 'Social designs', 'Design'],
    menu: ['Menu design', 'Menu pages', 'Page'],
  }[category]
  const collections = [collection(`${category}/${id}`, count, primary[1], primary[2]), ...extra]

  return {
    slug: `${category}-${id}`,
    category,
    title,
    type: primary[0],
    description,
    cover: collections[0].images[0],
    collections,
    imageCount: collections.reduce((total, set) => total + set.images.length, 0),
  }
}

export const projectGroups = [
  {
    id: 'branding',
    title: 'Branding',
    description: 'Visual identities and how they come to life across print and digital.',
    projects: [
      project('branding', 'elixir', 'Elixir', 22, 'A visual identity presentation for Elixir.'),
      project('branding', 'doorz', 'Doorz', 50, 'A brand identity presentation for Doorz.'),
      project('branding', 'sakhr', 'Sakhr', 10, 'A visual identity presentation for Sakhr.'),
      archivedProject('branding', {
        slug: 'logofolio',
        title: 'Logofolio',
        type: 'Logos & visual identity',
        description: 'Six identities shown across logos, print materials, packaging, signage and digital applications.',
        cover: archivedArtwork(23, 'Identity with a butterfly mark'),
      }, [
        archivedArtwork(22, 'Dental brand identity'),
        archivedArtwork(23, 'Identity with a butterfly mark'),
        archivedArtwork(24, 'Geometric brand identity'),
        archivedArtwork(25, 'Burgerica visual identity'),
        archivedArtwork(26, 'Arabic brand identity'),
        archivedArtwork(27, 'Sakhr industrial identity'),
      ]),
    ],
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Social posts, campaign visuals, and digital artwork organized by client.',
    projects: [
      project('social-media', 'elixir', 'Elixir', 10, 'A set of social designs for Elixir.'),
      project('social-media', 'happy-hub', 'Happy Hub', 3, 'A set of social designs for Happy Hub.'),
      project('social-media', 'mossa', 'Mossa', 6, 'A set of social designs for Mossa.'),
      project('social-media', 'selvo', 'Selvo', 3, 'A set of social designs for Selvo.'),
      project('social-media', 'sq', 'SQ', 9, 'Social designs and a separate catalogue presentation for SQ.', [
        collection('social-media/sq/catalogue', 42, 'SQ catalogue', 'Catalogue page'),
      ]),
      project('social-media', 'topping-pizza', 'Topping Pizza', 3, 'A set of social designs for Topping Pizza.'),
      project('social-media', 'west-wood', 'West Wood', 10, 'A set of social designs for West Wood.'),
      archivedProject('social-media', {
        slug: 'social-media',
        title: 'Social Media Visuals',
        type: 'Client work · Egypt & Saudi Arabia',
        description: 'Social designs for healthcare, hospitality, food, automotive and other businesses in Egypt and Saudi Arabia.',
        cover: archivedArtwork(14, 'Brisket & Oriental'),
      }, [
        archivedArtwork(5, 'Dr. Fares Aldaghri · Saudi Arabia'),
        archivedArtwork(6, 'Juva · Saudi Arabia'),
        archivedArtwork(7, 'Athar · Egypt and Hawraa Alsaif · Saudi Arabia'),
        archivedArtwork(8, 'Dr. Khaled Sunbol · Saudi Arabia'),
        archivedArtwork(9, 'Dr. Mohamed Shoeib · Saudi Arabia'),
        archivedArtwork(10, 'Qimat Alteb and Tahaluf Alashiqqa · Saudi Arabia'),
        archivedArtwork(11, 'V Care · Saudi Arabia'),
        archivedArtwork(12, 'Marketing campaign · Saudi Arabia'),
        archivedArtwork(13, 'LB Wings and Zakham · Saudi Arabia'),
        archivedArtwork(14, 'Brisket & Oriental · Egypt'),
        archivedArtwork(15, 'Servqual · Egypt'),
        archivedArtwork(16, 'Zadna Factory · Egypt'),
      ]),
      archivedProject('social-media', {
        slug: 'saudi-national-day',
        title: 'Saudi National Day',
        type: 'Campaign visuals',
        description: 'A collection of four widescreen visuals created for Saudi National Day.',
        cover: archivedArtwork(18, 'Saudi National Day designs'),
      }, [archivedArtwork(18, 'Saudi National Day designs')]),
      archivedProject('social-media', {
        slug: 'saudi-founding-day',
        title: 'Saudi Founding Day',
        type: 'Campaign visuals',
        description: 'Six widescreen campaign visuals for Saudi Founding Day.',
        cover: archivedArtwork(20, 'Saudi Founding Day designs'),
      }, [archivedArtwork(20, 'Saudi Founding Day designs')]),
    ],
  },
  {
    id: 'menu',
    title: 'Menu',
    description: 'Menu design for cafés and restaurants, with each menu shown in page order.',
    projects: [
      project('menu', 'mossa', 'Mossa', 3, 'The drinks and food menu for Mossa.'),
      project('menu', 'doorz', 'Doorz', 5, 'The Doorz menu and a separate two-page print layout.', [
        collection('menu/doorz/print', 2, 'Print layout', 'Print page'),
      ]),
      project('menu', 'topping-pizza', 'Topping Pizza', 3, 'The restaurant menu for Topping Pizza.'),
    ],
  },
].map((group, index) => ({
  ...group,
  number: number(index + 1),
  projects: group.projects.map((item, projectIndex) => ({ ...item, number: number(projectIndex + 1) })),
  cover: group.projects[0].cover,
  gallery: group.projects.map(({ cover }) => cover),
}))

export const projects = projectGroups.flatMap((group) => group.projects)

const originalGallerySlugs = ['social-media', 'saudi-national-day', 'saudi-founding-day', 'logofolio']
export const portfolioPreviews = [
  ...projectGroups.map((group) => ({
    id: `category-${group.id}`,
    title: group.title,
    description: group.description,
    cover: group.cover,
    previews: group.gallery,
    detail: `${group.projects.length} projects`,
    href: `#/categories/${group.id}`,
  })),
  ...originalGallerySlugs.map((slug) => {
    const project = projects.find((item) => item.slug === slug)
    return {
      id: `gallery-${slug}`,
      title: project.title,
      description: project.description,
      cover: project.cover,
      previews: project.collections.flatMap(({ images }) => images),
      detail: project.type,
      href: `#/work/${slug}`,
    }
  }),
].map((preview, index) => ({ ...preview, number: number(index + 1) }))

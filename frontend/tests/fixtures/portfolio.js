const image = (reference) => ({ asset: { _ref: reference } });

export const portfolioProjects = [
  {
    _id: '76792a18-7e92-45e9-b4a7-854304deee3f',
    title: 'JPMorgan SAEI',
    slug: 'jpmorgan-saei',
    legacySlugs: ['jpmorgan saei'],
    tags: ['Editing', 'Blender', '3D'],
    arsenal: [{ name: 'Blender' }, { name: 'DaVinci' }, { name: 'Premiere' }, { name: 'AfterEffects' }],
    disciplines: ['3d-vfx', 'motion', 'editing'],
    featured: false,
    description: 'A motion and editing project for JPMorgan SAEI.',
    mainImage: image('image-ea495433d01714c174f7f534bcb617b7c69ac3e9-1920x1080-jpg'),
  },
  {
    _id: '7cbc83f8-b6dd-4ba0-8345-4d74de7530fe',
    title: 'SIT Open House 2026',
    slug: 'sit-open-house-2026',
    tags: ['Interactive', 'Blender', '3D'],
    arsenal: [{ name: 'Three.js' }, { name: 'Blender' }],
    disciplines: ['3d-vfx', 'interactive'],
    featured: false,
    description: 'An interactive Three.js experience for SIT Open House 2026.',
    mainImage: image('image-63be03b374cd1fedb08e75fd252a5ca70c451200-681x681-png'),
    additionalImages: [image('image-51afde07df8421194186f86a7b061e19b37441eb-1920x1080-png'), image('image-4fb270893e389aa1e813ae10cde973bedc891a84-3840x2160-png')],
  },
  {
    _id: 'e66165bf-e44e-489e-b0f3-bda746df25e0',
    title: 'Dune sand',
    slug: 'dune-sand',
    legacySlugs: ['dune sand'],
    tags: ['3D', 'Houdini'],
    arsenal: [{ name: 'Houdini' }, { name: 'After Effects' }],
    disciplines: ['3d-vfx', 'motion'],
    featured: false,
    description: 'A procedural Houdini sand study.',
    mainImage: image('image-0ee98f34526b7158fb0bd519660eca9daea6f798-1080x1920-png'),
  },
  {
    _id: '13f2854e-b7b9-4dd6-81d7-ae7db468f09b',
    title: 'Cinder',
    slug: 'cinder',
    tags: ['3D', 'Unreal Engine', 'Maya'],
    arsenal: [{ name: 'Maya' }, { name: 'Redshift' }, { name: 'Unreal Engine' }, { name: 'OBS' }, { name: 'Xsens' }],
    featured: false,
    description: 'A real-time character and environment project.',
    mainImage: image('image-6cb458474016f4b556f7de38ba5798f4b979bfef-350x350-jpg'),
    additionalImages: [image('image-be8828d4785d430e30f16b4be57141c6abf1d844-500x500-jpg')],
  },
  {
    _id: '2a63559b-03a3-49a6-bde5-71b9ff46373a',
    title: "What's Your Energy Score - Samsung",
    slug: 'what-s-your-energy-score-samsung',
    tags: ['Editing'],
    arsenal: [{ name: 'Premiere Pro' }],
    description: 'An editorial project for Samsung.',
    mainImage: image('image-f7b67e73fc12bcb4fd53c911cc68f2c22ff90d05-360x640-png'),
  },
  {
    _id: 'ffa719bd-696e-4467-a795-afd03898d8d9',
    title: 'Visa - Future View',
    slug: 'visafw',
    tags: ['3D', '3ds Max'],
    arsenal: [{ name: '3ds Max' }, { name: 'After Effects' }],
    description: 'A 3D motion project for Visa.',
    mainImage: image('image-d692d506c0755c264b47c76a8dae9f2eb0202e62-350x350-jpg'),
  },
  {
    _id: '9c01c12d-6ab1-42ba-a840-373f55ea1dfa',
    title: 'HPB',
    slug: 'hpb',
    tags: ['3D', 'Maya', 'AfterEffects'],
    arsenal: [{ name: 'Maya' }, { name: 'Vray' }, { name: 'After Effects' }],
    featured: false,
    description: 'A 3D motion project for HPB.',
    mainImage: image('image-7cd6a183b0435f6b4ff5128477c586e6f7997fca-350x350-jpg'),
  },
  {
    _id: '1401b46f-3ed1-4f58-8700-9a3ae726ef17',
    title: 'NUHS Nurses Day',
    slug: 'NUHS',
    tags: ['3D', '3ds Max', 'AfterEffects'],
    arsenal: [{ name: '3ds Max' }, { name: 'Vray' }, { name: 'After Effects' }],
    description: 'A 3D motion project for NUHS Nurses Day.',
    mainImage: image('image-d2ec5ee6fe29f73b5cb683d055e596e8a42ce235-350x350-jpg'),
  },
  {
    _id: '9046ce0e-98fa-4d86-ae7c-64e784ac6234',
    title: 'Betadine Sore Throat Lozenges',
    slug: 'betadine-sore-throat-lozenges',
    tags: ['3D', 'Maya', 'AfterEffects'],
    arsenal: [{ name: 'Maya' }, { name: 'Vray' }, { name: 'After Effects' }],
    description: 'A product visualization project for Betadine.',
    mainImage: image('image-50a0f4c952ec54e6f925e85a7f295c8e186fd4e8-400x400-jpg'),
  },
  {
    _id: '1ce93d2c-93e1-4a9e-be06-2f82562c3a8b',
    title: 'Betadine Sore Throat Spray',
    slug: 'betadine-sore-throat-spray',
    tags: ['3D', 'Maya', 'AfterEffects'],
    arsenal: [{ name: 'Maya' }, { name: 'After Effects' }],
    description: 'A product visualization project for Betadine.',
    mainImage: image('image-4e2ba83d2d7134963244c08463595ed784505311-350x350-jpg'),
  },
  {
    _id: 'aff48c48-a72f-4da2-a770-58e3bc7c143c',
    title: 'Particle Sea',
    slug: 'particle-sea',
    tags: ['3D', 'Houdini', 'AfterEffects'],
    arsenal: [{ name: 'Houdini' }],
    description: 'A procedural particle simulation study.',
    mainImage: image('image-f7347eb2cf7e9b9a3ef8c3b92d90c09d0008ba5a-1080x1350-png'),
  },
  {
    _id: 'ecd20989-3f6d-4ebf-82ad-6b9fe96371bc',
    title: 'Save My World - Mediacorp',
    slug: 'save-my-world-mediacorp',
    tags: ['3D'],
    arsenal: [{ name: '3ds Max' }, { name: 'Vray' }],
    description: 'A 3D campaign project for Mediacorp.',
    mainImage: image('image-4749519cd8c1b35999c4382dbd6512d6f31b99d7-1280x720-jpg'),
  },
  {
    _id: '431b632f-108c-4a71-ac81-78abc2b1a163',
    title: 'Stop Asian Hate - ONE Championship',
    slug: 'stop-asian-hate',
    tags: ['AfterEffects'],
    arsenal: [{ name: 'After Effects' }],
    description: 'A motion graphics project for ONE Championship.',
    mainImage: image('image-5d00793c490930307af7dbbc61c426a8c8292270-1280x720-jpg'),
  },
];

export const blogPosts = [
  {
    _id: 'a1c2b064-f515-486d-9e12-fe9cefdb22dc',
    title: 'Shophouse Generator',
    slug: 'shophouse-generator',
    excerpt: 'A shophouse generator using Houdini and Unreal Engine',
    publishedAt: '2025-08-19T06:35:01.719Z',
    mainImage: image('image-3e90a93f120b09b84d2a979c01f4ed229c4c57d6-1920x1080-jpg'),
    body: [],
  },
  {
    _id: 'rnd-cinder',
    title: 'Cinder Notes',
    slug: 'cinder-notes',
    excerpt: 'A compact R&D note about procedural rendering.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    body: [],
    tags: ['Three.js'],
    mainImage: image('image-cindernotes-1200x630-jpg'),
  },
];

function requestDetails(requestUrl, postData) {
  const url = new URL(requestUrl);
  let body = {};
  try {
    body = JSON.parse(postData || '{}');
  } catch {
    // GET requests carry their query and params in the URL.
  }

  const query = url.searchParams.get('query') || body.query || postData || '';
  const params = { ...body.params, ...Object.fromEntries(url.searchParams.entries()) };
  const rawSlug = params.slug || params.$slug;
  let requestedSlug = rawSlug;
  try {
    requestedSlug = JSON.parse(rawSlug);
  } catch {
    // Sanity sends string parameters as JSON in the query string; raw values remain valid fixtures.
  }

  return { query, requestedSlug };
}

export function sanityResponseFor(requestUrl, postData, {
  projects = portfolioProjects,
  posts = blogPosts,
} = {}) {
  const { query, requestedSlug } = requestDetails(requestUrl, postData);

  if (query.includes('portfolioItem')) {
    if (query.includes('$slug')) {
      return projects.find((project) => (
        project.slug === requestedSlug || project.legacySlugs?.includes(requestedSlug)
      )) || null;
    }
    return projects;
  }
  if (query.includes('blogPost')) {
    if (query.includes('a1c2b064-f515-486d-9e12-fe9cefdb22dc')) return posts.filter((post) => post._id === 'a1c2b064-f515-486d-9e12-fe9cefdb22dc');
    if (query.includes('$slug')) {
      return posts.find((post) => post.slug === requestedSlug) || null;
    }
    return posts;
  }
  return [];
}

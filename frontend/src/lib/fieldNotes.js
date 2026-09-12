// Curated published entries; IDs select content, while titles and URLs stay in Sanity.
export const FIELD_NOTES_QUERY = `*[_type == "blogPost" && !(_id in path("drafts.**")) && _id == "a1c2b064-f515-486d-9e12-fe9cefdb22dc"] { _id, title, "slug": slug.current, mainImage, excerpt }`;

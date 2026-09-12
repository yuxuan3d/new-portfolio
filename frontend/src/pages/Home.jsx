import React, { useEffect, useMemo } from 'react';
import KineticLanding, { KineticStudio, KineticWork } from '../components/home/KineticLanding';
import { useSanityData } from '../hooks/useSanityData';
import { FIELD_NOTES_QUERY } from '../lib/fieldNotes';

const PROJECTS_QUERY = `*[_type == "portfolioItem" && !(_id in path("drafts.**"))] | order(orderRank) {
  _id, title, "slug": slug.current,
  mainImage{..., asset->{_id,url,metadata{dimensions}}},
  additionalImages[]{..., asset->{_id,url,metadata{dimensions}}},
  projectLink, tags, "arsenal": arsenal[]{name}, disciplines, featured
}`;

export default function Home({ onLayoutReady, overlayOpen }) {
  const [projectItems, projectError, { isValidating, hasResolved, mutate }] = useSanityData(PROJECTS_QUERY);
  const [notes, notesError, notesState] = useSanityData(FIELD_NOTES_QUERY);
  const projects = useMemo(() => Array.isArray(projectItems) ? projectItems.filter((project) => project.title && project.slug) : [], [projectItems]);
  const retry = () => { mutate().catch(() => {}); };
  useEffect(() => { if (hasResolved && notesState.hasResolved) onLayoutReady?.(); }, [hasResolved, notesState.hasResolved, onLayoutReady]);
  const workProps = { projects, error: projectError, isLoading: isValidating && !projectItems, onRetry: retry };
  return <KineticLanding {...workProps} overlayOpen={overlayOpen}>
    <KineticWork {...workProps} />
    <KineticStudio projects={projects} posts={notes} error={notesError} isLoading={notesState.isValidating && !notes} onRetry={() => notesState.mutate().catch(() => {})} />
  </KineticLanding>;
}

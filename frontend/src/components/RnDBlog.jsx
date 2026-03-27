import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import LazyImage from './LazyImage';
import LoadingState from './LoadingState';

const QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  mainImage,
  excerpt,
  tags
}`;

function formatPublishedDate(value) {
  if (!value) return 'Updating';

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function RnDBlog() {
  const [blogPosts, error, { isValidating }] = useSanityData(QUERY);
  const totalPosts = Array.isArray(blogPosts) ? blogPosts.length : 0;
  const latestPublishedAt = totalPosts > 0 ? blogPosts[0].publishedAt : null;

  return (
    <Page>
      <Hero>
        <Eyebrow>R&amp;D Journal</Eyebrow>
        <Title>Process notes, technical breakdowns, and experiments in motion.</Title>
        <Subtitle>
          The journal keeps the exploratory side of the practice visible: tests, implementation
          notes, production learnings, and visual studies that feed back into the portfolio work.
        </Subtitle>
        <MetaRow>
          <MetaChip>{totalPosts} posts</MetaChip>
          <MetaChip>Latest: {formatPublishedDate(latestPublishedAt)}</MetaChip>
        </MetaRow>
      </Hero>

      {error ? <ErrorCard>{error}</ErrorCard> : null}

      {isValidating && !blogPosts ? (
        <LoadingState label="Loading R&D Posts" minHeight="360px" margin="0" />
      ) : totalPosts > 0 ? (
        <Grid>
          {blogPosts.map((post) => (
            <Card key={post.slug} to={`/rnd/${post.slug}`}>
              {post.mainImage ? (
                <CardImage>
                  <LazyImage
                    src={urlFor(post.mainImage).auto('format').width(900).height(600).fit('crop').quality(90).url()}
                    alt={post.title}
                  />
                </CardImage>
              ) : null}

              <CardBody>
                <PostMeta>{formatPublishedDate(post.publishedAt)}</PostMeta>
                <PostTitle>{post.title}</PostTitle>
                {post.excerpt ? <PostExcerpt>{post.excerpt}</PostExcerpt> : null}
                {Array.isArray(post.tags) && post.tags.length > 0 ? (
                  <TagRow>
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagRow>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <h2>No R&amp;D posts yet.</h2>
          <p>Check back soon.</p>
        </EmptyState>
      )}
    </Page>
  );
}

const panelStyles = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 100%),
    ${({ theme }) => theme.surface};
  box-shadow: 0 18px 44px ${({ theme }) => theme.shadowStrong};
`;

const Page = styled.div`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 3rem) 0 4rem;
  display: grid;
  gap: 1.2rem;
`;

const Hero = styled.header`
  ${panelStyles}
  padding: clamp(1.2rem, 3vw, 2rem);
  display: grid;
  gap: 0.7rem;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 13ch;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  color: ${({ theme }) => theme.text.primary};
`;

const Subtitle = styled.p`
  max-width: 62ch;
  color: ${({ theme }) => theme.text.secondary};
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const MetaChip = styled.span`
  min-height: 34px;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.76rem;
  font-family: 'IBM Plex Mono', monospace;
`;

const ErrorCard = styled.div`
  ${panelStyles}
  padding: 1rem 1.1rem;
  color: #ffb2a6;
  border-color: rgba(255, 178, 166, 0.24);
  background: rgba(140, 44, 32, 0.18);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  ${panelStyles}
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  display: grid;
`;

const CardImage = styled.div`
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.03);
    filter: brightness(0.82);
  }
`;

const CardBody = styled.div`
  padding: 1rem 1rem 1.1rem;
  display: grid;
  gap: 0.55rem;
`;

const PostMeta = styled.p`
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.72rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const PostTitle = styled.h2`
  font-size: 1.45rem;
  color: ${({ theme }) => theme.text.primary};
`;

const PostExcerpt = styled.p`
  color: ${({ theme }) => theme.text.secondary};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.1rem;
`;

const Tag = styled.span`
  min-height: 30px;
  padding: 0.42rem 0.62rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.72rem;
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const EmptyState = styled.div`
  ${panelStyles}
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  padding: 1rem;

  h2 {
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.4rem;
  }
`;

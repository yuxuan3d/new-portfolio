import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BLOG_CONTENT } from '../../content/siteContent';
import { urlFor } from '../../lib/sanityClient';
import LoadingState from '../LoadingState';
import LazyImage from '../LazyImage';

function formatPublishedDate(value) {
  if (!value) return 'Updating';

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogPreviewSection({ posts, error, isLoading }) {
  const previewPosts = Array.isArray(posts) ? posts.slice(0, 3) : [];

  return (
    <Section id="blog">
      <Header>
        <Title>{BLOG_CONTENT.title}</Title>
        <AllPostsLink to="/rnd">View All Posts</AllPostsLink>
      </Header>

      {error ? <ErrorCard>{error}</ErrorCard> : null}

      {isLoading ? (
        <LoadingState label="Loading R&D Posts" minHeight="300px" margin="0" />
      ) : previewPosts.length > 0 ? (
        <Grid $count={previewPosts.length}>
          {previewPosts.map((post) => (
            <Card key={post.slug} to={`/rnd/${post.slug}`}>
              {post.mainImage ? (
                <CardImage>
                  <LazyImage
                    src={urlFor(post.mainImage).auto('format').width(900).height(600).fit('crop').quality(90).url()}
                    alt={post.title}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </CardImage>
              ) : null}
              <CardBody>
                <PostMeta>{formatPublishedDate(post.publishedAt)}</PostMeta>
                <PostTitle>{post.title}</PostTitle>
                {post.excerpt ? <PostExcerpt>{post.excerpt}</PostExcerpt> : null}
                {Array.isArray(post.tags) && post.tags.length > 0 ? (
                  <TagRow>
                    {post.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagRow>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </Grid>
      ) : (
        <EmptyState>No R&D posts yet.</EmptyState>
      )}
    </Section>
  );
}

const panelStyles = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0;
  background: ${({ theme }) => theme.surface};
`;

const Section = styled.section`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.6rem) 0 0;
  display: grid;
  gap: 0.95rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  max-width: 20ch;
  font-size: clamp(1.55rem, 2.45vw, 2.35rem);
  color: ${({ theme }) => theme.text.primary};
  text-wrap: pretty;
`;

const AllPostsLink = styled(Link)`
  min-height: 42px;
  padding: 0.75rem 0.9rem;
  border-radius: 0;
  text-decoration: none;
  color: ${({ theme }) => theme.accent};
  border: 1px solid ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accentSurface};
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    border-color: ${({ theme }) => theme.button.background};
  }
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
  width: 100%;
  max-width: ${({ $count }) => {
    if ($count === 1) return '29rem';
    if ($count === 2) return '54rem';
    return 'none';
  }};
  grid-template-columns: ${({ $count }) => {
    if ($count === 1) return 'minmax(0, 1fr)';
    if ($count === 2) return 'repeat(2, minmax(0, 1fr))';
    return 'repeat(3, minmax(0, 1fr))';
  }};
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
  font-size: 0.68rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const PostTitle = styled.h3`
  font-size: 1.12rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.1;
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
  border-radius: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.68rem;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const EmptyState = styled.div`
  ${panelStyles}
  min-height: 180px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: 1rem;
`;

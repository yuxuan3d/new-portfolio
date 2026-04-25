import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BLOG_CONTENT } from '../content/siteContent';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import { MEDIA } from '../styles/breakpoints';
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

  return (
    <Page>
      <SectionHeader>
        <Title>{BLOG_CONTENT.title}</Title>
      </SectionHeader>

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
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 100%),
    ${({ theme }) => theme.surface};
  box-shadow: 0 18px 44px ${({ theme }) => theme.shadowStrong};

  ${MEDIA.tabletDown} {
    border-radius: 18px;
  }

  ${MEDIA.phone} {
    border-radius: 14px;
  }
`;

const Page = styled.div`
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: calc(var(--site-header-height, 96px) + clamp(1.4rem, 4vw, 3rem)) 0 4rem;
  display: grid;
  gap: 1.2rem;
`;

const SectionHeader = styled.header`
  display: grid;
  gap: 0.35rem;
  padding-left: var(--panel-padding);

  ${MEDIA.phone} {
    padding-left: 0;
  }
`;

const Title = styled.h1`
  max-width: 20ch;
  font-size: clamp(1.55rem, 2.45vw, 2.35rem);
  color: ${({ theme }) => theme.text.primary};
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

  ${MEDIA.tabletOnly} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${MEDIA.phone} {
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
  padding: var(--panel-padding);
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

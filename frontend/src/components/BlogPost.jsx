import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import styled, { css } from 'styled-components';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import { MEDIA } from '../styles/breakpoints';
import BlogLazyImage from './BlogLazyImage';
import LoadingState from './LoadingState';

const QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  publishedAt,
  mainImage,
  body,
  tags
}`;

function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <MediaFigure>
        <BlogLazyImage
          src={urlFor(value).width(1200).fit('max').auto('format').url()}
          alt={value.alt || ''}
          style={{ maxHeight: '720px', width: 'auto', objectFit: 'contain' }}
        />
        {value.caption ? <figcaption>{value.caption}</figcaption> : null}
      </MediaFigure>
    ),
    youtube: ({ value }) => {
      const videoId = getYouTubeId(value.url);
      if (!videoId) return null;

      return (
        <MediaFigure>
          <YouTubeEmbed>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </YouTubeEmbed>
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </MediaFigure>
      );
    },
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, error, { isValidating }] = useSanityData(QUERY, { slug });

  if (isValidating && !post) {
    return (
      <Page>
        <LoadingState label="Loading post" minHeight="360px" margin="0" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <ErrorCard>Error loading blog post.</ErrorCard>
      </Page>
    );
  }

  if (!post) {
    return (
      <Page>
        <EmptyCard>Blog post not found.</EmptyCard>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink to="/rnd">Back to Journal</BackLink>

      <Hero>
        <Eyebrow>R&amp;D Post</Eyebrow>
        <Title>{post.title}</Title>
        <PublishDate>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </PublishDate>
      </Hero>

      {post.mainImage ? (
        <MainImage>
          <BlogLazyImage
            src={urlFor(post.mainImage).width(1400).auto('format').fit('max').url()}
            alt={post.title}
          />
        </MainImage>
      ) : null}

      <ContentPanel>
        <PortableText value={post.body} components={portableTextComponents} />
      </ContentPanel>

      {Array.isArray(post.tags) && post.tags.length > 0 ? (
        <TagRow>
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagRow>
      ) : null}
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

const Page = styled.article`
  width: min(980px, calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: calc(var(--site-header-height, 96px) + clamp(1.1rem, 3vw, 2rem)) 0 4rem;
  display: grid;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  width: fit-content;
  min-height: 42px;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.76rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Hero = styled.header`
  ${panelStyles}
  padding: var(--panel-padding);
  display: grid;
  gap: 0.6rem;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: clamp(1.95rem, 6vw, 4.6rem);
  color: ${({ theme }) => theme.text.primary};
`;

const PublishDate = styled.time`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.8rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MainImage = styled.div`
  ${panelStyles}
  padding: 0.45rem;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    max-height: 680px;
    object-fit: cover;
    border-radius: 20px;
  }
`;

const ContentPanel = styled.div`
  ${panelStyles}
  min-width: 0;
  padding: var(--panel-padding);
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.05rem;
  line-height: 1.75;

  p,
  ul,
  ol,
  blockquote,
  pre {
    margin-bottom: 1.25rem;
  }

  h1,
  h2,
  h3 {
    margin: 2rem 0 0.85rem;
    color: ${({ theme }) => theme.text.primary};
    font-size: clamp(1.55rem, 3vw, 2.45rem);
  }

  ul,
  ol {
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: 0.45rem;
  }

  a {
    color: ${({ theme }) => theme.accent};
  }

  img,
  iframe,
  video {
    max-width: 100%;
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.accent};
    padding: 0.85rem 1rem;
    border-radius: 0 18px 18px 0;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.text.primary};
  }

  code,
  pre {
    font-family: 'IBM Plex Mono', monospace;
  }

  pre {
    padding: 1rem;
    border-radius: 20px;
    max-width: 100%;
    overflow-x: auto;
    background: rgba(0, 0, 0, 0.24);
    border: 1px solid ${({ theme }) => theme.border};
  }

  figcaption {
    margin-top: 0.5rem;
    color: ${({ theme }) => theme.text.muted};
    font-size: 0.82rem;
    text-align: center;
  }
`;

const MediaFigure = styled.figure`
  margin: 2rem auto;
  text-align: center;
  max-width: 100%;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 24px;
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

const YouTubeEmbed = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(0, 0, 0, 0.24);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
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

const ErrorCard = styled.div`
  ${panelStyles}
  padding: 1rem 1.1rem;
  color: #ffb2a6;
  border-color: rgba(255, 178, 166, 0.24);
  background: rgba(140, 44, 32, 0.18);
`;

const EmptyCard = styled.div`
  ${panelStyles}
  min-height: 180px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text.secondary};
  padding: 1rem;
`;

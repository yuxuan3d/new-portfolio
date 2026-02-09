import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PortableText } from '@portabletext/react';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import BlogLazyImage from './BlogLazyImage';
import LoadingState from './LoadingState';

const BlogContainer = styled.article`
  max-width: 980px;
  margin: 0 auto;
  padding: 2.8rem 0 3.8rem;
`;

const BlogHeader = styled.header`
  margin-bottom: 1rem;
  text-align: left;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 1.4rem 1.2rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
`;

const Kicker = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 0.55rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.06;
`;

const PublishDate = styled.time`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const MainImage = styled.div`
  width: 100%;
  max-height: 500px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};

  img {
    max-width: 100%;
    max-height: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const Content = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.05rem;
  line-height: 1.68;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 1.45rem 1.25rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};

  p {
    margin-bottom: 1.3rem;
  }

  h1, h2, h3 {
    margin: 2rem 0 0.8rem;
    color: ${({ theme }) => theme.text.primary};
  }

  blockquote {
    margin: 1.4rem 0;
    padding: 0.9rem 1rem;
    border-left: 4px solid ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    border-radius: 10px;
  }

  figure {
    margin: 2rem auto;
    text-align: center;
    max-width: 100%;
  }

  img {
    max-width: 100%;
    height: auto;
    width: auto;
    display: inline-block;
  }

  figcaption {
    text-align: center;
    font-size: 0.86rem;
    color: ${({ theme }) => theme.text.secondary};
    margin-top: 0.5rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  color: ${({ theme }) => theme.accent};
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
`;

const YouTubeEmbed = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin: 1.8rem 0;
  width: 100%;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Notice = styled.div`
  padding: 1.2rem;
  border-radius: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`;

const ErrorNotice = styled(Notice)`
  color: #d44841;
  border-color: rgba(212, 72, 65, 0.45);
  background: rgba(212, 72, 65, 0.1);
`;

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const components = {
  types: {
    image: ({ value }) => {
      const imageAssetRef = value?.asset?._ref;
      const sizePart = imageAssetRef?.split('-')?.[2];
      const [width, height] = (sizePart?.split('x') || []).map((v) => parseInt(v, 10));
      const dimensions = Number.isFinite(width)
        ? { width, height: Number.isFinite(height) ? height : undefined }
        : null;

      return (
        <figure>
          <BlogLazyImage
            src={urlFor(value)
              .width(dimensions?.width || 900)
              .fit('max')
              .auto('format')
              .url()}
            alt={value.alt || ''}
            style={{
              maxHeight: '620px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    youtube: ({ value }) => {
      const videoId = getYouTubeId(value.url);
      if (!videoId) return <ErrorNotice>Invalid YouTube URL</ErrorNotice>;

      return (
        <figure>
          <YouTubeEmbed>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </YouTubeEmbed>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const query = `*[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    body,
    tags
  }`;

  const [post, error, { isValidating }] = useSanityData(query, { slug });

  if (isValidating && !post) {
    return (
      <BlogContainer>
        <LoadingState label="Loading post" minHeight="360px" margin="0" />
      </BlogContainer>
    );
  }

  if (error) {
    return (
      <BlogContainer>
        <ErrorNotice>Error loading blog post.</ErrorNotice>
      </BlogContainer>
    );
  }

  if (!post) {
    return (
      <BlogContainer>
        <Notice>Blog post not found.</Notice>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <BlogHeader>
        <Kicker>R&amp;D Post</Kicker>
        <Title>{post.title}</Title>
        <PublishDate>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </PublishDate>
      </BlogHeader>

      {post.mainImage && (
        <MainImage>
          <BlogLazyImage
            src={urlFor(post.mainImage).width(1000).auto('format').fit('max').url()}
            alt={post.title}
          />
        </MainImage>
      )}

      <Content>
        <PortableText
          value={post.body}
          components={components}
        />
      </Content>

      {post.tags && (
        <TagContainer>
          {post.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagContainer>
      )}
    </BlogContainer>
  );
};

export default BlogPost;

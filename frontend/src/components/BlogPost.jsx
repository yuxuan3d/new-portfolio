import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PortableText } from '@portabletext/react';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import BlogLazyImage from './BlogLazyImage';

const BlogContainer = styled.article`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const BlogHeader = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text.primary};
`;

const PublishDate = styled.time`
  color: ${props => props.theme.text.secondary};
  font-size: 1rem;
`;

const MainImage = styled.div`
  width: 100%;
  max-height: 400px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 400px;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const Content = styled.div`
  color: ${props => props.theme.text.primary};
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;

  p {
    margin-bottom: 1.5rem;
  }

  h1, h2, h3 {
    margin: 2rem 0 1rem;
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 1rem;
    border-left: 4px solid ${props => props.theme.accent};
    background: ${props => props.theme.accent}10;
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
    font-size: 0.9rem;
    color: ${props => props.theme.text.secondary};
    margin-top: 0.5rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
  justify-content: center;
`;

const Tag = styled.span`
  background: ${props => props.theme.accent}20;
  color: ${props => props.theme.accent};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const YouTubeEmbed = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin: 2rem 0;
  width: 100%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const components = {
  types: {
    image: ({value}) => {
      // Get the original image dimensions if available
      const imageAssetRef = value?.asset?._ref;
      const sizePart = imageAssetRef?.split('-')?.[2]; // e.g. "800x600"
      const [width, height] = (sizePart?.split('x') || []).map((v) => parseInt(v, 10));
      const dimensions = Number.isFinite(width)
        ? { width, height: Number.isFinite(height) ? height : undefined }
        : null;
      
      return (
        <figure>
          <BlogLazyImage
            src={urlFor(value)
              // Only set width if we have dimensions, otherwise let it be natural size
              .width(dimensions?.width || 800)
              .fit('max')
              .auto('format')
              .url()}
            alt={value.alt || ''}
            style={{
              maxHeight: '600px', // Maximum height for any image
              width: 'auto',     // Let width be automatic
              objectFit: 'contain' // Ensure image isn't stretched
            }}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    youtube: ({value}) => {
      const videoId = getYouTubeId(value.url);
      if (!videoId) return <div>Invalid YouTube URL</div>;
      
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
    }
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

  if (isValidating && !post) return <div>Loading...</div>;
  if (error) return <div>Error loading blog post</div>;
  if (!post) return <div>Blog post not found</div>;

  return (
    <BlogContainer>
      <BlogHeader>
        <Title>{post.title}</Title>
        <PublishDate>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </PublishDate>
      </BlogHeader>

      {post.mainImage && (
        <MainImage>
          <BlogLazyImage
            src={urlFor(post.mainImage).width(800).url()}
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

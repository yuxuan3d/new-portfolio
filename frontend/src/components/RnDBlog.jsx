import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSanityData } from '../hooks/useSanityData';
import LazyImage from './LazyImage';
import { urlFor } from '../lib/sanityClient';
import LoadingState from './LoadingState';

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlogCard = styled.article`
  background: ${props => props.theme.card.background};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
  }
`;

const BlogImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text.primary};
`;

const BlogExcerpt = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const BlogDate = styled.time`
  color: ${props => props.theme.text.secondary};
  font-size: 0.8rem;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background: ${props => props.theme.accent}20;
  color: ${props => props.theme.accent};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const RnDBlog = () => {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    excerpt,
    tags
  }`;
  
  const [blogPosts, error, { isValidating }] = useSanityData(query);

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (isValidating && !blogPosts) {
    return <LoadingState label="Loading R&D Posts" margin="2rem 0" />;
  }

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    return (
      <EmptyState>
        <h2>No R&amp;D posts yet</h2>
        <p>Check back soon.</p>
      </EmptyState>
    );
  }

  return (
    <BlogGrid>
      {blogPosts?.map((post) => (
        <BlogCard key={post.slug}>
          <Link to={`/rnd/${post.slug}`} style={{ textDecoration: 'none' }}>
            {post.mainImage && (
              <BlogImage>
                <LazyImage
                  src={urlFor(post.mainImage).auto('format').width(600).fit('max').url()}
                  alt={post.title}
                />
              </BlogImage>
            )}
            <BlogContent>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogDate>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </BlogDate>
              {post.excerpt && <BlogExcerpt>{post.excerpt}</BlogExcerpt>}
              {post.tags && (
                <TagContainer>
                  {post.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagContainer>
              )}
            </BlogContent>
          </Link>
        </BlogCard>
      ))}
    </BlogGrid>
  );
};

const EmptyState = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 6vw;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};

  h2 {
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const ErrorState = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 6vw;
  text-align: center;
  font-size: 1.1rem;
  color: #e74c3c;
`;

export default RnDBlog;

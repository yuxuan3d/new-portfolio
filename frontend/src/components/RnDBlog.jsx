import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSanityData } from '../hooks/useSanityData';
import LazyImage from './LazyImage';
import { urlFor } from '../lib/sanityClient';

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

  if (isValidating && !blogPosts) return <div>Loading...</div>;
  if (error) return <div>Error loading blog posts: {JSON.stringify(error)}</div>;
  
  // Debug information
  console.log('Blog posts:', blogPosts);
  
  if (!blogPosts || !Array.isArray(blogPosts) || blogPosts.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No blog posts found</h2>
        <p>Query: {query}</p>
        <p>Raw data received: {JSON.stringify(blogPosts)}</p>
      </div>
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
                  src={urlFor(post.mainImage).width(600).url()}
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

export default RnDBlog;

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSanityData } from '../hooks/useSanityData';
import LazyImage from './LazyImage';
import { urlFor } from '../lib/sanityClient';
import LoadingState from './LoadingState';

const Page = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.9rem 0 4rem;
`;

const Header = styled.header`
  margin-bottom: 1.8rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 1.65rem 1.4rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: auto -90px -120px auto;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}1f`};
    pointer-events: none;
  }
`;

const Kicker = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

const Title = styled.h1`
  margin: 0 0 0.55rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.04;
  color: ${({ theme }) => theme.text.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  max-width: 62ch;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

const HeaderMeta = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const MetaItem = styled.span`
  display: inline-flex;
  padding: 0.3rem 0.68rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.76rem;
  font-weight: 700;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.1rem;
`;

const BlogCard = styled.article`
  background: ${({ theme }) => theme.surface};
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: transform 0.25s ease, background-color 0.3s ease, box-shadow 0.25s ease;
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};

    img {
      transform: scale(1.05);
    }
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
    transition: transform 0.4s ease;
  }
`;

const BlogContent = styled.div`
  padding: 1.15rem 1.1rem 1.2rem;
`;

const BlogTitle = styled.h2`
  font-size: 1.35rem;
  margin-bottom: 0.45rem;
  color: ${({ theme }) => theme.text.primary};
`;

const BlogExcerpt = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.94rem;
  line-height: 1.55;
  margin-bottom: 0.9rem;
`;

const BlogDate = styled.time`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
  font-size: 0.77rem;
  font-weight: 700;
`;

function formatPublishedDate(value) {
  if (!value) return 'Updating';

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

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
  const totalPosts = Array.isArray(blogPosts) ? blogPosts.length : 0;
  const latestPublishedAt =
    Array.isArray(blogPosts) && blogPosts.length > 0 ? blogPosts[0].publishedAt : null;

  if (error) {
    return (
      <Page>
        <Header>
          <Kicker>R&amp;D Journal</Kicker>
          <Title>Experiments and Notes</Title>
          <Subtitle>
            Process breakdowns, visual tests, and technical writeups from ongoing studio work.
          </Subtitle>
          <HeaderMeta aria-label="R&D feed status">
            <MetaItem>{totalPosts} posts</MetaItem>
            <MetaItem>Latest: {formatPublishedDate(latestPublishedAt)}</MetaItem>
          </HeaderMeta>
        </Header>
        <ErrorState>{error}</ErrorState>
      </Page>
    );
  }

  if (isValidating && !blogPosts) {
    return (
      <Page>
        <Header>
          <Kicker>R&amp;D Journal</Kicker>
          <Title>Experiments and Notes</Title>
          <Subtitle>
            Process breakdowns, visual tests, and technical writeups from ongoing studio work.
          </Subtitle>
          <HeaderMeta aria-label="R&D feed status">
            <MetaItem>{totalPosts} posts</MetaItem>
            <MetaItem>Latest: {formatPublishedDate(latestPublishedAt)}</MetaItem>
          </HeaderMeta>
        </Header>
        <LoadingState label="Loading R&D Posts" margin="0" minHeight="360px" />
      </Page>
    );
  }

  if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
    return (
      <Page>
        <Header>
          <Kicker>R&amp;D Journal</Kicker>
          <Title>Experiments and Notes</Title>
          <Subtitle>
            Process breakdowns, visual tests, and technical writeups from ongoing studio work.
          </Subtitle>
          <HeaderMeta aria-label="R&D feed status">
            <MetaItem>{totalPosts} posts</MetaItem>
            <MetaItem>Latest: {formatPublishedDate(latestPublishedAt)}</MetaItem>
          </HeaderMeta>
        </Header>
        <EmptyState>
          <h2>No R&amp;D posts yet</h2>
          <p>Check back soon.</p>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <Kicker>R&amp;D Journal</Kicker>
        <Title>Experiments and Notes</Title>
        <Subtitle>
          Process breakdowns, visual tests, and technical writeups from ongoing studio work.
        </Subtitle>
        <HeaderMeta aria-label="R&D feed status">
          <MetaItem>{totalPosts} posts</MetaItem>
          <MetaItem>Latest: {formatPublishedDate(latestPublishedAt)}</MetaItem>
        </HeaderMeta>
      </Header>

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
    </Page>
  );
};

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.surface};

  h2 {
    color: ${({ theme }) => theme.text.primary};
    margin-bottom: 0.5rem;
  }
`;

const ErrorState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: #d44841;
  border-radius: 18px;
  border: 1px solid rgba(212, 72, 65, 0.45);
  background: rgba(212, 72, 65, 0.1);
`;

export default RnDBlog;

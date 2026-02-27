import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';
import BlogList from './blog/BlogList';
import BlogPost from './blog/BlogPost';

const BlogView: React.FC = () => {
  const { slug } = useParams();
  
  // Use local data directly
  const posts = BLOG_POSTS;

  const selectedPost = useMemo(() => posts.find(p => p.slug === slug), [slug, posts]);

  if (slug && selectedPost) {
    return <BlogPost post={selectedPost} />;
  }

  // If slug exists but post not found, fallback to list view
  return <BlogList posts={posts} loading={false} />;
};

export default BlogView;

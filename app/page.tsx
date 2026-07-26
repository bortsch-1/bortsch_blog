'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Blog[];
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <h1>My Blog</h1>
          <nav>
            <Link href="/">ホーム</Link>
            <Link href="/admin">管理画面</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <h2>最新の記事</h2>
        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : blogs.length === 0 ? (
          <div className="loading">記事がまだありません</div>
        ) : (
          <div className="blog-list">
            {blogs.map(blog => (
              <div key={blog.id} className="blog-card">
                {blog.imageUrl && (
                  <img src={blog.imageUrl} alt={blog.title} />
                )}
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 100)}...</p>
                <p className="meta">
                  {blog.createdAt?.toLocaleDateString('ja-JP')}
                </p>
                <Link href={`/blog/${blog.id}`}>続きを読む →</Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}

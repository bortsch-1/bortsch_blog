'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Blog {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export default function BlogDetail({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'blogs', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate(),
          } as Blog);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!blog) {
    return <div className="loading">記事が見つかりません</div>;
  }

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
        <Link href="/">← ホームに戻る</Link>
        <article style={{ maxWidth: '800px', margin: '40px auto' }}>
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            />
          )}
          <h1>{blog.title}</h1>
          <p style={{ color: '#999', marginBottom: '30px' }}>
            {blog.createdAt?.toLocaleDateString('ja-JP')}
          </p>
          <div
            style={{
              lineHeight: '1.8',
              color: '#333',
              fontSize: '16px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {blog.content}
          </div>
        </article>
      </main>

      <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}

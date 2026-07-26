'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LoginForm from '@/components/LoginForm';
import BlogForm from '@/components/BlogForm';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <header>
        <div className="container">
          <h1>管理画面</h1>
          <nav>
            <span>ログイン中: {user.email}</span>
            <button onClick={handleLogout} className="button-secondary">
              ログアウト
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <h2>新しい記事を投稿</h2>
        <BlogForm />
      </main>

      <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
      </footer>
    </>
  );
}

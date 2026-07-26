'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let imageUrl = '';

      if (file) {
        const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setMessage('記事を投稿しました！');
      setTitle('');
      setContent('');
      setFile(null);
      setPreview('');
    } catch (err: any) {
      setError('投稿に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="記事のタイトルを入力"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="記事の内容を入力"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">画像</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '4px',
                }}
              />
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </div>
  );
}

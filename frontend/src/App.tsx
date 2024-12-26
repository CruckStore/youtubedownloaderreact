// App.tsx
import React, { useState } from 'react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Veuillez entrer une URL valide.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Échec du téléchargement.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>YouTube Downloader</h1>
      <input
        type="text"
        placeholder="Entrez l'URL de la vidéo YouTube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '80%', padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Téléchargement...' : 'Télécharger en 4K'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
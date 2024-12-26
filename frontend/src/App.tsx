import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Veuillez entrer une URL valide.');
      return;
    }

    setError('');
    setLoading(true);
    setProgress(0);

    try {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/progress');
          const data = await response.json();
          setProgress(data.progress);
          if (data.progress >= 100) {
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);
          clearInterval(interval);
        }
      }, 1000);

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

      // Lorsque le téléchargement est terminé, définir la progression à 100%
      setProgress(100);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>YouTube Downloader</h1>
      <input
        type="text"
        placeholder="Entrez l'URL de la vidéo YouTube"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="url-input"
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        className="download-button"
      >
        {loading ? 'Téléchargement...' : 'Télécharger en 4K'}
      </button>
      {progress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default App;

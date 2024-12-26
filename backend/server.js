const express = require('express');
const cors = require('cors');
const { exec } = require('youtube-dl-exec');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    // Configure les en-têtes pour le fichier téléchargé
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

    const video = exec(
      url,
      {
        format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
        output: '-',
        ffmpegLocation: 'C:\\path\\to\\ffmpeg\\bin\\ffmpeg.exe', // Chemin FFmpeg
        mergeOutputFormat: 'mp4',
      },
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    video.stdout.on('data', (chunk) => {
      try {
        res.write(chunk);
      } catch (error) {
        console.warn('Erreur lors de l\'écriture dans le flux de la réponse :', error.message);
      }
    });

    video.stdout.on('end', () => {
      try {
        res.end();
        console.log('Téléchargement terminé.');
      } catch (error) {
        console.warn('Erreur lors de la fermeture de la réponse :', error.message);
      }
    });

    video.on('error', (err) => {
      console.error('Erreur lors du téléchargement :', err);
      if (!res.headersSent) {
        res.status(500).send('Erreur de téléchargement');
      }
    });
  } catch (err) {
    console.error('Erreur globale :', err.message);
    if (!res.headersSent) {
      res.status(500).send('Erreur lors du traitement de la requête');
    }
  }
});

// Démarre le serveur
app.listen(5000, () => console.log('Server running on http://localhost:5000'));

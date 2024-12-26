const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    res.setHeader('Content-Disposition', 'attachment; filename=\"video.mp4\"');
    const video = youtubedl.exec(url, {
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
      output: '-',
    });

    video.stdout.pipe(res);
  } catch (err) {
    res.status(500).send('Error downloading video');
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
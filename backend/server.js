const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { quality: 'highestvideo' }).pipe(res);
  } catch (err) {
    res.status(500).send('Error downloading video');
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
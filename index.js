const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + uniqueSuffix + fileExtension;
    const filePath = '/files/' + fileName;
    cb(null, fileName);
    req.filePath = filePath;
  },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/files', express.static('files')); // Serve static files from the 'files' directory

app.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).send(req.filePath);
});

app.get('/list', async (req, res) => {
  try {
    const files = await fs.readdir('files');
    res.json(files);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join('files', fileName);

  try {
    await fs.unlink(filePath);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
         

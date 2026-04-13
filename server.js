import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Store detection history (in production, use database)
const detectionHistory = [];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Upload image for detection
app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const detectionId = uuidv4();
    const detectionEntry = {
      id: detectionId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      timestamp: new Date(),
      objects: [], // Will be filled by frontend detection
      confidence: 0,
    };

    detectionHistory.push(detectionEntry);

    res.json({
      success: true,
      detectionId,
      message: 'Image uploaded successfully. Ready for AI processing.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detection history
app.get('/api/history', (req, res) => {
  res.json(detectionHistory);
});

// Get specific detection
app.get('/api/detection/:id', (req, res) => {
  const detection = detectionHistory.find((d) => d.id === req.params.id);
  if (!detection) {
    return res.status(404).json({ error: 'Detection not found' });
  }
  res.json(detection);
});

// Update detection results
app.post('/api/detection/:id/results', express.json(), (req, res) => {
  const detection = detectionHistory.find((d) => d.id === req.params.id);
  if (!detection) {
    return res.status(404).json({ error: 'Detection not found' });
  }

  detection.objects = req.body.objects || [];
  detection.confidence = req.body.confidence || 0;

  res.json({ success: true, detection });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://192.168.100.154:${PORT}`);
});

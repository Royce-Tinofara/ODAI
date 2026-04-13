import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import axios from 'axios';
import WebcamDetector from './components/WebcamDetector';
import ImageUploader from './components/ImageUploader';
import DetectionHistory from './components/DetectionHistory';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('webcam');
  const [detections, setDetections] = useState([]);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the COCO-SSD model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('✓ AI Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🖥️ Computer Object Identification AI</h1>
        <p>Real-time detection of computer hardware and components</p>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading AI Model...</p>
        </div>
      )}

      {!loading && (
        <main className="app-main">
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'webcam' ? 'active' : ''}`}
              onClick={() => setActiveTab('webcam')}
            >
              📹 Webcam Detection
            </button>
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📤 Image Upload
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📊 History
            </button>
          </nav>

          <div className="content">
            {activeTab === 'webcam' && model && (
              <WebcamDetector model={model} setDetections={setDetections} />
            )}
            {activeTab === 'upload' && model && (
              <ImageUploader model={model} setDetections={setDetections} />
            )}
            {activeTab === 'history' && <DetectionHistory />}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
